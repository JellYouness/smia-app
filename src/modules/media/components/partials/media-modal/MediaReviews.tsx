import { Box, Typography, Stack } from '@mui/material';
import { MediaPostReview } from '../../../defs/types';

interface MediaReviewsProps {
  reviews: MediaPostReview[];
}

const MediaReviews = ({ reviews }: MediaReviewsProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 2, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}
      >
        Reviews ({reviews.length})
      </Typography>
      <Stack spacing={1}>
        {reviews.map((review, idx) => (
          <Box
            key={review.id || idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: review.decision === 'APPROVED' ? '#f0fdf4' : '#fef3f2',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: review.decision === 'APPROVED' ? '#10b981' : '#ef4444',
              }}
            />
            <Typography variant="body2" color="text.primary">
              {review.reviewerType}: {review.decision}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MediaReviews;
