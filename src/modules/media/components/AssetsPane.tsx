import React, { useState, useCallback } from 'react';
import { Box, CircularProgress, Paper, Typography, Button } from '@mui/material';
import MediaFileSection from './MediaFileSection';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { ROLE } from '@modules/permissions/defs/types';
import VersionsSection from './VersionsSection';
import useSWR, { mutate } from 'swr';
import useMedia from '../hooks/useMedia';
import { MediaPostAsset, MediaPost, FileItem, MEDIA_POST_STATUS } from '../defs/types';
import useUploads from '@modules/uploads/hooks/api/useUploads';
import { Description, Error, Image } from '@mui/icons-material';
import { ApprovedAsset, DistributeResult, DistributeModal } from './distribute';

interface AssetsPaneProps {
  selectedPostId: number | null;
}

const AssetsPane = ({ selectedPostId }: AssetsPaneProps) => {
  const { user } = useAuth();
  const { readAllAssetsByPost, addAssetToMediaPost, deleteAssetFromMediaPost, readOne } =
    useMedia();
  const { createOne: uploadFile } = useUploads();
  const { data, isLoading } = useSWR(
    selectedPostId ? ['/media_posts', selectedPostId, 'assets'] : null,
    () => (selectedPostId ? readAllAssetsByPost(selectedPostId) : null)
  );
  const assets: MediaPostAsset[] = data?.data?.items || [];

  // Fetch the full MediaPost (with assignments)
  const { data: postData } = useSWR(selectedPostId ? ['/media_posts', selectedPostId] : null, () =>
    selectedPostId ? readOne(selectedPostId) : null
  );
  const mediaPost: MediaPost | undefined = postData?.data?.item;
  const assignments = mediaPost?.assignments || [];

  // Loading states
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, FileItem>>(new Map());
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  // Modal states
  const [distributeModalOpen, setDistributeModalOpen] = useState(false);

  // Toggle state for sections
  const [expandedSections, setExpandedSections] = useState({
    reference: true,
    drafts: false,
    versions: false,
  });
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Distribute assets
  const referenceAssets = assets.filter((a) => a.isReference);
  const draftAssets = assets.filter((a) => !a.isReference && !a.versionId);
  const versionedAssets = assets.filter((a) => !!a.versionId && a.version);

  // Group versioned assets by versionId
  const versionsMap = new Map();
  versionedAssets.forEach((asset) => {
    if (!asset.version) {
      return;
    }
    const vId = String(asset.versionId);
    if (!versionsMap.has(vId)) {
      // build a safe “createdBy” string
      const vcUser = asset.version.creator?.user;
      const createdBy = vcUser ? `${vcUser.firstName} ${vcUser.lastName}` : 'Unknown';

      versionsMap.set(vId, {
        id: asset.versionId,
        number: asset.version.number,
        status: asset.version.status,
        createdBy,
        createdAt: asset.version.createdAt,
        files: [],
      });
    }
    versionsMap.get(vId).files.push({
      id: String(asset.id),
      name: asset.upload?.name || String(asset.id),
      size: asset.upload?.size || 0,
      type: asset.mimeType,
      uploadedBy: (() => {
        const u = asset.uploader;
        return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
      })(),
      uploadedAt: asset.upload?.createdAt || '',
      url: asset.upload?.url || '',
    });
  });
  const versions = Array.from(versionsMap.values());

  // Check if any version is under review
  const isDraftSuspended = versions.some((v) => v.status === 'IN_REVIEW');
  const draftSuspendedMessage = isDraftSuspended
    ? 'Draft uploads are suspended while a version is under review.'
    : undefined;

  // Check if current user is the project owner
  const isProjectOwner = Boolean(
    user && mediaPost?.project?.client && user.id === mediaPost.project.client.userId
  );

  // Find the last version (with files)
  const lastVersionWithAssets = versions.length > 0 ? versions[versions.length - 1] : undefined;

  // Convert assets to ApprovedAsset format for distribute modal
  const approvedAssets: ApprovedAsset[] = assets
    .filter(
      (asset) => asset.isReference || (asset.versionId && asset.version?.status === 'APPROVED')
    )
    .map((asset) => ({
      id: String(asset.id),
      kind: (() => {
        if (asset.mimeType?.startsWith('image/')) {
          return 'image' as const;
        }
        if (asset.mimeType?.startsWith('video/')) {
          return 'video' as const;
        }
        if (asset.mimeType?.startsWith('audio/')) {
          return 'audio' as const;
        }
        if (asset.mimeType === 'application/pdf') {
          return 'pdf' as const;
        }
        return 'image' as const;
      })(),
      width: asset.upload?.width,
      height: asset.upload?.height,
      durationSec: asset.upload?.duration,
      name: asset.upload?.name || String(asset.id),
      url: asset.upload?.url || '',
      tags: asset.tags || [],
    }));

  if (!user) {
    return null;
  }

  // Function to get file URL by asset ID
  const getFileUrl = useCallback(
    (fileId: string): string => {
      const asset = assets.find((a) => String(a.id) === fileId);
      return asset?.upload?.url || '';
    },
    [assets]
  );

  // Upload and add asset helper with loading state
  const handleAddAsset = async (
    files: FileList,
    opts: { isReference: boolean; versionId?: number }
  ) => {
    if (!selectedPostId) {
      return;
    }

    const fileArray = Array.from(files);
    const tempUploadingFiles = new Map<string, FileItem>();

    // Add files to uploading state
    fileArray.forEach((file) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const tempFile: FileItem = {
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        isUploading: true,
        isReference: opts.isReference,
        versionId: opts.versionId,
      };
      tempUploadingFiles.set(tempId, tempFile);
    });

    setUploadingFiles((prev) => new Map([...Array.from(prev), ...Array.from(tempUploadingFiles)]));

    try {
      await Promise.all(
        fileArray.map(async (file) => {
          const tempId = Array.from(tempUploadingFiles.keys()).find(
            (id) => tempUploadingFiles.get(id)?.name === file.name
          );

          // ① upload
          const uploadRes = await uploadFile({ file, name: file.name });
          if (!uploadRes.success || !uploadRes.data?.item) {
            // remove the temp placeholder for this file only
            if (tempId) {
              setUploadingFiles((prev) => {
                const next = new Map(prev);
                next.delete(tempId);
                return next;
              });
            }
            return; // ⟵ replaces the old `continue`
          }

          // ② attach upload to the media-post
          const uploadId = uploadRes.data.item.id;
          await addAssetToMediaPost(selectedPostId, {
            uploadId,
            mimeType: file.type,
            isReference: opts.isReference,
            ...(opts.versionId !== undefined ? { versionId: opts.versionId } : {}),
            uploadedBy: user.id,
          });
        })
      );
    } catch (error) {
      // Clear all uploading files on error
      setUploadingFiles(new Map());
    }

    // 3. Refetch assets and only clear uploadingFiles after mutate completes
    await mutate(['/media_posts', selectedPostId, 'assets']);
    setUploadingFiles(new Map());
  };

  // Delete asset handler with loading state
  const handleDeleteAsset = async (fileId: string) => {
    if (!selectedPostId) {
      return;
    }

    // Add to deleting state
    setDeletingFiles((prev) => new Set([...Array.from(prev), fileId]));

    try {
      await deleteAssetFromMediaPost(selectedPostId, Number(fileId));
      // Refetch assets and only clear deletingFiles after mutate completes
      await mutate(['/media_posts', selectedPostId, 'assets']);
    } catch (error) {
      console.error('Failed to delete asset:', error);
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const mergeAssetsWithUploading = (
    realAssets: MediaPostAsset[],
    isReference: boolean,
    versionId?: number
  ) => {
    const realFiles = realAssets.map((a) => ({
      id: String(a.id),
      name: a.upload?.name || String(a.id),
      size: a.upload?.size || 0,
      type: a.mimeType,
      lastModified: a.upload?.lastModified || 0,
      isDeleting: deletingFiles.has(String(a.id)),
      isReference: a.isReference,
      versionId: a.versionId,
      uploadedBy: a.uploadedBy,
      createdAt: a.upload?.createdAt || a.createdAt || '',
    }));

    const uploadingForSection = Array.from(uploadingFiles.values()).filter((file) => {
      return file.isReference === isReference && file.versionId === versionId;
    });

    // Sort real files by creation date (newest first) and put uploading files at the top
    const sortedRealFiles = realFiles.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });

    return [...uploadingForSection, ...sortedRealFiles];
  };

  const handleDistributeSubmit = (payload: DistributeResult) => {
    console.log('Distribution payload received:', payload);
    setDistributeModalOpen(false);
  };

  if (!selectedPostId) {
    return <EmptyState />;
  }
  if (isLoading) {
    return <LoadingState />;
  }
  if (!data || !Array.isArray(assets)) {
    return <ErrorState />;
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Scrollable content area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          pb: 0, // Remove bottom padding since we have the button below
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(32, 101, 209, 0.3)',
            borderRadius: '4px',
          },
        }}
      >
        <MediaFileSection
          title="Reference Assets"
          files={mergeAssetsWithUploading(referenceAssets, true).map((file) => ({
            ...file,
            canDelete: user?.userType !== ROLE.CREATOR,
          }))}
          onFilesAdd={(files) => handleAddAsset(files, { isReference: true })}
          isExpanded={expandedSections.reference}
          onToggle={() => toggleSection('reference')}
          onFileDelete={handleDeleteAsset}
          getFileUrl={getFileUrl}
          user={user}
          showUploadInput={user?.userType !== ROLE.CREATOR}
        />

        <VersionsSection
          versions={versions}
          isExpanded={expandedSections.versions}
          onToggle={() => toggleSection('versions')}
          isProjectOwner={isProjectOwner}
          lastVersionWithAssets={lastVersionWithAssets}
          postId={selectedPostId}
          reviews={mediaPost?.reviews || []}
        />

        {user?.userType === ROLE.CREATOR && (
          <MediaFileSection
            title="Draft Files"
            files={mergeAssetsWithUploading(draftAssets, false).map((file) => ({
              ...file,
              canDelete:
                user?.userType === ROLE.CREATOR
                  ? file.uploadedBy === user.id // Only allow delete if uploaded by this user
                  : true,
            }))}
            onFilesAdd={(files) => handleAddAsset(files, { isReference: false })}
            isExpanded={expandedSections.drafts}
            onToggle={() => toggleSection('drafts')}
            onFileDelete={handleDeleteAsset}
            getFileUrl={getFileUrl}
            showUploadInput={user?.userType === ROLE.CREATOR && !isDraftSuspended}
            suspendedMessage={draftSuspendedMessage}
            postId={selectedPostId}
            assignments={assignments}
            user={user}
          />
        )}
      </Box>

      {/* Distribute Button - Fixed at the bottom */}
      <Box
        sx={{
          p: 2,
          pt: 1,
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Button
          variant="contained"
          fullWidth
          disabled={
            !mediaPost ||
            mediaPost.status !== MEDIA_POST_STATUS.APPROVED ||
            approvedAssets.length === 0
          }
          onClick={() => setDistributeModalOpen(true)}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 2,
            '&:hover': { backgroundColor: 'primary.dark' },
            height: 40,
            '&:disabled': {
              backgroundColor: 'action.disabled',
              color: 'action.disabled',
            },
          }}
        >
          Distribute
        </Button>
      </Box>

      <DistributeModal
        open={distributeModalOpen}
        onClose={() => setDistributeModalOpen(false)}
        approvedAssets={approvedAssets}
        onSubmit={handleDistributeSubmit}
      />
    </Box>
  );
};

export default AssetsPane;

// Empty State Component
const EmptyState = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
      p: 4,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: 'rgba(32, 101, 209, 0.04)',
        border: '2px dashed rgba(32, 101, 209, 0.2)',
        maxWidth: 320,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'rgba(32, 101, 209, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <Description sx={{ fontSize: 28, color: 'rgba(32, 101, 209, 0.6)' }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        No Media Post Selected
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.5,
        }}
      >
        Choose a media post from the list to view and manage its assets
      </Typography>
    </Paper>
  </Box>
);

// Loading State Component
const LoadingState = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
      p: 4,
    }}
  >
    <Box
      sx={{
        position: 'relative',
        mb: 3,
      }}
    >
      <CircularProgress
        size={56}
        thickness={3}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Image sx={{ fontSize: 24, color: 'rgba(32, 101, 209, 0.6)' }} />
      </Box>
    </Box>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: 'text.primary',
        mb: 1,
      }}
    >
      Loading Assets
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: 'text.secondary',
        maxWidth: 280,
        lineHeight: 1.5,
      }}
    >
      Fetching media files and organizing your content...
    </Typography>

    {/* Animated dots */}
    <Box sx={{ mt: 2, display: 'flex', gap: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            opacity: 0.3,
            animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
            '@keyframes pulse': {
              '0%, 80%, 100%': {
                opacity: 0.3,
                transform: 'scale(1)',
              },
              '40%': {
                opacity: 1,
                transform: 'scale(1.2)',
              },
            },
          }}
        />
      ))}
    </Box>
  </Box>
);

// Error State Component
const ErrorState = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
      p: 4,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: 'rgba(244, 67, 54, 0.04)',
        border: '2px solid rgba(244, 67, 54, 0.1)',
        maxWidth: 320,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <Error sx={{ fontSize: 28, color: 'rgba(244, 67, 54, 0.7)' }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'error.main',
          mb: 1,
        }}
      >
        Unable to Load Assets
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.5,
          mb: 2,
        }}
      >
        There was an issue loading the assets for this media post
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'text.disabled',
          fontStyle: 'italic',
        }}
      >
        Try refreshing the page or contact support if the issue persists
      </Typography>
    </Paper>
  </Box>
);
