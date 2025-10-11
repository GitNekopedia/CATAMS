import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list':
    'Quickly build standard, pages based on `block` development',

  'tutor.dashboard.welcome.greeting': 'Good morning, {name}, wish you a happy day!',
  'tutor.dashboard.welcome.identity': 'Welcome to CATAMS. Your current role is {role}',

  'topBanner.greeting': '{greeting}, {name}, wish you a happy day!',
  'topBanner.role.lecturer': 'Course Coordinator | CATAMS Platform',
  'topBanner.role.tutor': 'Tutor | CATAMS Platform',
  'topBanner.stat.courses': 'Courses',
  'topBanner.stat.rank': 'Team Rank',
  'topBanner.stat.visits': 'Project Visits',

  'greeting.morning': 'Good morning',
  'greeting.noon': 'Good noon',
  'greeting.afternoon': 'Good afternoon',
  'greeting.evening': 'Good evening',

  // CourseCards
  'courseCards.empty': 'Empty',
  'courseCards.modalTitle': 'All Assigned Courses',
  'courseCards.lecturer.title': 'Assigned Courses',
  'courseCards.tutor.title': 'My Courses',
  'courseCards.code': 'Course Code',
  'courseCards.name': 'Course Name',
  'courseCards.totalBudget': 'Total Budget (hrs)',
  'courseCards.remainingBudget': 'Remaining Budget (hrs)',
  'courseCards.payRate': 'Pay Rate ($/hr)',
  'courseCards.quotaHours': 'Quota Hours (hrs)',

  // ActivityBase
  'activity.unit.unknown': 'Unknown Course',
  'activity.hours': 'Hours',
  'activity.workType': 'Type',
  'activity.status.approved': 'Approved',
  'activity.status.rejected': 'Rejected',
  'activity.status.submitted': 'Submitted',
  'activity.status.draft': 'Draft',

  // ActivityLecturer
  'activity.lecturer.header': 'Recent Work Entries',
  'activity.lecturer.tutor': 'Tutor',
  'activity.lecturer.approve': 'Approve',
  'activity.lecturer.reject': 'Reject',
  'activity.lecturer.unknownTutor': 'Unknown',

  // ActivityTutor
  'activity.tutor.title': 'Tutor Work Submission',
  'activity.tutor.add': 'Add Work Entry',
  'activity.tutor.modalTitle': 'Submit Work Entry',
  'activity.tutor.course': 'Course',
  'activity.tutor.selectCourse': 'Please select a course',
  'activity.tutor.substitute': 'Substitute',
  'activity.tutor.substituteLabel': 'Substitute for another tutor',
  'activity.tutor.substituteTutor': 'Substitute Tutor',
  'activity.tutor.selectSubstitute': 'Please select a substitute tutor',
  'activity.tutor.allocation': 'Task Allocation',
  'activity.tutor.selectAllocation': 'Please select a task',
  'activity.tutor.actualHours': 'Actual Hours',
  'activity.tutor.description': 'Description',
  'activity.tutor.loadCourseFail': 'Failed to load courses',
  'activity.tutor.submitSuccess': 'Submitted successfully',
  'activity.tutor.submitFail': 'Submit failed',
  'activity.tutor.warning.noCourse': 'Please select a course first',
  'activity.tutor.error.noAllocation': 'No corresponding allocation found',
  'activity.tutor.plannedHours': 'Planned Hours',

  // PendingApprovals
  'pendingApprovals.header': 'Pending Approvals',
  'pendingApprovals.approve': 'Approve',
  'pendingApprovals.reject': 'Reject',
  'pendingApprovals.duration': 'Requested Duration: {hours} hours',

  // StatCards
  'statCards.submittedHours': 'Submitted Hours',
  'statCards.remainingBudget': 'Remaining Budget',
  'statCards.approvalRate': 'Approval Rate',

  // DetailedLecturerPendingApprovals
  'approvals.header': 'Pending Work Entries',
  'approvals.searchPlaceholder': 'Search tutor/course/description',
  'approvals.col.tutor': 'Tutor',
  'approvals.col.unit': 'Course',
  'approvals.col.code': 'Course Code',
  'approvals.col.weekStart': 'Week Start',
  'approvals.col.type': 'Type',
  'approvals.col.hours': 'Hours',
  'approvals.col.desc': 'Description',
  'approvals.col.status': 'Status',
  'approvals.col.action': 'Actions',
  'approvals.action.approve': 'Approve',
  'approvals.action.reject': 'Reject',
  'approvals.action.processed': 'Processed',
  'approvals.flow.detail': 'Approval Flow',
  'approvals.flow.none': 'No approval records',
  'approvals.modal.approve': 'Approve Work Entry',
  'approvals.modal.reject': 'Reject Work Entry',
  'approvals.modal.ok': 'Confirm',
  'approvals.modal.cancel': 'Cancel',
  'approvals.modal.comment.approve': 'Approval Comment',
  'approvals.modal.comment.reject': 'Rejection Reason',
  'approvals.modal.comment.placeholder.approve': 'Optional approval comment',
  'approvals.modal.comment.placeholder.reject': 'Please enter rejection reason',
  'approvals.message.success.approve': 'Approved, comment: {comment}',
  'approvals.message.success.approve.noComment': 'Approved',
  'approvals.message.success.reject': 'Rejected, reason: {comment}',
  'approvals.message.error': 'Operation failed',
  'approvals.message.loadFail': 'Failed to load',

  // UnitAllocations
  'unitAlloc.selectUnit': 'Select Unit',
  'unitAlloc.chooseUnit': 'Choose a Unit',
  'unitAlloc.editTasks': 'Edit Unit Tasks',
  'unitAlloc.allocations': 'Tutor Allocations',
  'unitAlloc.taskTypes': 'Task Types',
  'unitAlloc.unitTasks': 'Unit Tasks',
  'unitAlloc.addType': 'Add Type',
  'unitAlloc.addTask': 'Add Task',
  'unitAlloc.addAllocation': 'Add Allocation',
  'unitAlloc.saveAllocations': 'Save Allocations',
  'unitAlloc.message.saveSuccess': 'Saved successfully',
  'unitAlloc.message.saveFail': 'Save failed',
  'unitAlloc.message.loadUnitFail': 'Failed to load courses',
  'unitAlloc.message.loadTutorFail': 'Failed to load tutors',
  'unitAlloc.message.taskTypeUsed': 'This type is in use and cannot be deleted',
  'unitAlloc.message.confirmDelete': 'Confirm delete this task?',
  'unitAlloc.message.deleted': 'Deleted',
  'unitAlloc.message.deleteFail': 'Delete failed',
  'unitAlloc.message.addSuccess': 'Added successfully',
  'unitAlloc.message.taskCreated': 'Task created',
  'unitAlloc.message.requestFail': 'Request failed, check backend API',
  'unitAlloc.allUnits': 'All Courses',

  // Tutor UnitAllocations
  'tutor.unitAlloc.allocations.by.course': 'View By Course',
  'tutor.unitAlloc.allocations.by.week': 'View By Week',

  'dashboard.loadFail': 'Failed to load data',

  'activity.tutor.myEntries': 'My Work Entries',
  'activity.tutor.submitTime': 'Submit Time',

  'avatar.center': 'Profile Center',
  'avatar.settings': 'Account Settings',
  'avatar.logout': 'Logout',

  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
