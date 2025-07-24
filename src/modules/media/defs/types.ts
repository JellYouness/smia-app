import { CrudObject, Id } from '@common/defs/types';
import { Creator } from '@modules/creators/defs/types';
import { Project } from '@modules/projects/defs/types';
import { Upload } from '@modules/uploads/defs/types';
import { User } from '@modules/users/defs/types';

export interface MediaPost extends CrudObject {
  title: string;
  description: string;
  status: MEDIA_POST_STATUS;
  priority: MEDIA_POST_PRIORITY;
  dueDate: string;
  projectId: Id;

  assignments?: MediaPostAssignment[];
  assets?: MediaPostAsset[];
  reviews?: MediaPostReview[];
  comments?: MediaPostComment[];

  project?: Project;
}

export interface MediaPostAssignment extends CrudObject {
  postId: Id;
  creatorId: Id;
  role: MEDIA_POST_ASSIGNMENT_ROLE;
  assignedAt: string;

  creator?: Creator;
}

export interface MediaPostAsset extends CrudObject {
  postId: Id;
  version: number;
  uploadId: Id;
  mimeType: string;
  uploadedBy: Id;

  uploader?: Creator;
  upload?: Upload;
}

export interface MediaPostReview extends CrudObject {
  postId: Id;
  reviewerId: Id;
  reviewerType: 'AMBASSADOR' | 'CLIENT';
  decision: MEDIA_POST_REVIEW_DECISION;
  comment: string;

  reviewer?: User;
}

export interface MediaPostComment extends CrudObject {
  postId: Id;
  assetId: Id;
  authorId: Id;
  body: string;
  timecode: number;

  author?: User;
}

export enum MEDIA_POST_STATUS {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}
export enum MEDIA_POST_PRIORITY {
  LOW = 'LOW',
  MED = 'MED',
  HIGH = 'HIGH',
}

export enum MEDIA_POST_ASSIGNMENT_ROLE {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
}

export enum MEDIA_POST_REVIEW_DECISION {
  APPROVED = 'APPROVED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
}
