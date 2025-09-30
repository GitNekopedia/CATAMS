/**
 * @see https://umijs.org/docs/max/access#access
 * */
// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canTutor: currentUser?.role === 'Tutor',
    canLecturer: currentUser?.role === 'Lecturer',
    canHR: currentUser?.role === 'HR',
    canAdmin: currentUser?.role === 'Admin',
  };
}
