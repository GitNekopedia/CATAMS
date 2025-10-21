import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import hrUnitAssignment from "@/locales/zh-CN/hr/unitAssignment";
import hrAssignmentForm from "@/locales/zh-CN/hr/components/assignmentForm";
import hrCourseForm from "@/locales/zh-CN/hr/components/courseForm";
import hrUserForm from "@/locales/zh-CN/hr/components/userForm";
import hrCourseManagement from "@/locales/zh-CN/hr/courseManagement";
import hrUserManagement from "@/locales/zh-CN/hr/userManagement";


export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',

  'tutor.dashboard.welcome.greeting': '早安，{name}，祝你开心每一天！11111',
  'tutor.dashboard.welcome.identity': '欢迎使用 CATAMS 系统。您当前身份是 {role}',

  'topBanner.greeting': '{greeting}，{name}，祝你开心每一天！',
  'topBanner.role.lecturer': '课程负责人 | CATAMS 平台',
  'topBanner.role.tutor': '助教 | CATAMS 平台',
  'topBanner.stat.courses': '课程数',
  'topBanner.stat.rank': '团队内排名',
  'topBanner.stat.visits': '项目访问',

  'greeting.morning': '早安',
  'greeting.noon': '中午好',
  'greeting.afternoon': '下午好',
  'greeting.evening': '晚上好',

  // CourseCards
  'courseCards.empty': '空',
  'courseCards.modalTitle': '我被分配的所有课程',
  'courseCards.lecturer.title': '已分配课程',
  'courseCards.tutor.title': '我参与的课程',
  'courseCards.code': '课程代码',
  'courseCards.name': '课程名称',
  'courseCards.totalBudget': '总预算（hrs）',
  'courseCards.remainingBudget': '剩余预算（hrs）',
  'courseCards.payRate': '工资标准 ($/hr)',
  'courseCards.quotaHours': '工时配额 (hrs)',

  // ActivityBase
  'activity.unit.unknown': '未知课程',
  'activity.hours': '工时',
  'activity.workType': '类型',
  'activity.status.approved': '已通过',
  'activity.status.rejected': '已驳回',
  'activity.status.submitted': '已提交',
  'activity.status.draft': '草稿',

  // ActivityLecturer
  'activity.lecturer.header': '最近的工时记录',
  'activity.lecturer.tutor': '助教',
  'activity.lecturer.approve': '通过',
  'activity.lecturer.reject': '驳回',
  'activity.lecturer.unknownTutor': '未知',

  // ActivityTutor
  'activity.tutor.title': 'Tutor 工时提交',
  'activity.tutor.add': '新增工时',
  'activity.tutor.modalTitle': '提交工时',
  'activity.tutor.course': '课程',
  'activity.tutor.selectCourse': '请选择课程',
  'activity.tutor.substitute': '是否代课',
  'activity.tutor.substituteLabel': '为其他 Tutor 代课',
  'activity.tutor.substituteTutor': '代课对象',
  'activity.tutor.selectSubstitute': '请选择被代课的 Tutor',
  'activity.tutor.allocation': '任务分配',
  'activity.tutor.selectAllocation': '请选择任务',
  'activity.tutor.actualHours': '实际工时',
  'activity.tutor.description': '备注',
  'activity.tutor.loadCourseFail': '加载课程失败',
  'activity.tutor.submitSuccess': '提交成功',
  'activity.tutor.submitFail': '提交失败',
  'activity.tutor.warning.noCourse': '请先选择课程',
  'activity.tutor.error.noAllocation': '未找到对应的任务分配',
  'activity.tutor.plannedHours': '分配时长',
  'activity.tutor.weekStart': '开始周',


  // PendingApprovals
  'pendingApprovals.header': '待审批工时',
  'pendingApprovals.approve': '批准',
  'pendingApprovals.reject': '拒绝',
  'pendingApprovals.duration': '申请时长: {hours} 小时',

  // StatCards
  'statCards.submittedHours': '已提交工时',
  'statCards.remainingBudget': '剩余预算',
  'statCards.approvalRate': '审批通过率',

  // DetailedLecturerPendingApprovals
  'approvals.header': '待审批工时记录',
  'approvals.header.hr': '审批工时管理',
  'approvals.searchPlaceholder': '搜索助教/课程/描述',
  'approvals.col.tutor': '助教',
  'approvals.col.unit': '课程',
  'approvals.col.code': '课程代码',
  'approvals.col.weekStart': '周起始',
  'approvals.col.type': '类型',
  'approvals.col.hours': '工时',
  'approvals.col.desc': '描述',
  'approvals.col.status': '状态',
  'approvals.col.action': '操作',
  'approvals.action.approve': '通过',
  'approvals.action.reject': '驳回',
  'approvals.action.processed': '已处理',
  'approvals.flow.detail': '审批流详情',
  'approvals.flow.none': '暂无审批记录',
  'approvals.modal.approve': '通过工时记录',
  'approvals.modal.reject': '驳回工时记录',
  'approvals.modal.ok': '确认',
  'approvals.modal.cancel': '取消',
  'approvals.modal.comment.approve': '通过批注',
  'approvals.modal.comment.reject': '驳回原因',
  'approvals.modal.comment.placeholder.approve': '可填写通过批注（选填）',
  'approvals.modal.comment.placeholder.reject': '请输入驳回原因（必填）',
  'approvals.message.success.approve': '已通过，批注：{comment}',
  'approvals.message.success.approve.noComment': '已通过',
  'approvals.message.success.reject': '已驳回，原因：{comment}',
  'approvals.message.error': '操作失败',
  'approvals.message.loadFail': '加载失败',

  // UnitAllocations
  'unitAlloc.selectUnit': '选择课程',
  'unitAlloc.chooseUnit': '请选择课程',
  'unitAlloc.editTasks': '编辑课程任务',
  'unitAlloc.allocations': 'Tutor 分配',
  'unitAlloc.taskTypes': '任务类型',
  'unitAlloc.unitTasks': '课程任务',
  'unitAlloc.addType': '新增类型',
  'unitAlloc.addTask': '新增任务',
  'unitAlloc.addAllocation': '新增分配',
  'unitAlloc.saveAllocations': '保存分配',
  'unitAlloc.message.saveSuccess': '保存成功',
  'unitAlloc.message.saveFail': '保存失败',
  'unitAlloc.message.loadUnitFail': '加载课程失败',
  'unitAlloc.message.loadTutorFail': '加载导师失败',
  'unitAlloc.message.taskTypeUsed': '该类型已被任务使用，无法删除',
  'unitAlloc.message.confirmDelete': '确认删除?',
  'unitAlloc.message.deleted': '已删除',
  'unitAlloc.message.deleteFail': '删除失败',
  'unitAlloc.message.addSuccess': '添加成功',
  'unitAlloc.message.taskCreated': '任务已创建',
  'unitAlloc.message.requestFail': '请求失败，请检查后端接口',
  'unitAlloc.allUnits': '所有课程',

  "unitAlloc.phdPayRate": "博士薪酬标准",
  "unitAlloc.nonPhdPayRate": "非博士薪酬标准",
  "unitAlloc.message.typeRequired": "请输入任务类型名称",
  "unitAlloc.message.phdPayRateRequired": "请输入博士薪酬标准",
  "unitAlloc.message.nonPhdPayRateRequired": "请输入非博士薪酬标准",
  "unitAlloc.message.invalidNumber": "请输入有效的数字",

  // Tutor UnitAllocations
  'tutor.unitAlloc.allocations.by.course': '按课程查看',
  'tutor.unitAlloc.allocations.by.week': '按周查看',


  'dashboard.loadFail': '加载数据失败',

  'activity.tutor.myEntries': '我的工时记录',
  'activity.tutor.submitTime': '提交时间',

  'avatar.center': '个人中心',
  'avatar.settings': '个人设置',
  'avatar.logout': '退出登录',



  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...hrUnitAssignment,
  ...hrAssignmentForm,
  ...hrCourseForm,
  ...hrUserForm,
  ...hrCourseManagement,
  ...hrUserManagement,

};
