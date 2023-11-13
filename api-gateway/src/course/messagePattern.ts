export const COURSE_MESSAGE_PATTERNS = {
  create: {
    prefix: 'course',
    action: 'create',
  },
  getOne: {
    prefix: 'course',
    action: 'get-one',
  },
  getList: {
    prefix: 'course',
    action: 'get-list',
  },
  uploadVideo: {
    prefix: 'course',
    action: 'upload-video',
  },
  getMyCourses: {
    prefix: 'course',
    action: 'get-my-courses',
  },
  delete: {
    prefix: 'course',
    action: 'delete',
  },
  update: {
    prefix: 'course',
    action: 'update',
  },
  enroll: {
    prefix: 'course',
    action: 'enroll',
  },
};

export const APPROVAL_REQUEST_MESSAGE_PATTERNS = {
  submitApprovalRequest: {
    prefix: 'approval-request',
    action: 'submit',
  },
  processApprovalRequest: {
    prefix: 'approval-request',
    action: 'process',
  },
  getListApprovalRequest: {
    prefix: 'approval-request',
    action: 'get-list',
  },
};
