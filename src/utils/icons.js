// Icon mappings for the entire application
import {
  FaHome, FaClipboardList, FaHistory, FaExclamationTriangle, FaChartBar,
  FaUser, FaUsers, FaChartLine, FaDollarSign, FaClock, FaCheckCircle,
  FaBell, FaSearch, FaEye, FaEdit, FaPlus, FaTimes, FaArrowLeft,
  FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard,
  FaFileAlt, FaDownload, FaFilter, FaSync, FaTrash, FaCog,
  FaSignOutAlt, FaBars, FaChevronDown, FaChevronUp, FaCheck,
  FaCrown, FaUserTie, FaBullseye, FaUserPlus, FaHandPaper,
  FaMoneyBillWave, FaCalendar, FaExclamation, FaInfoCircle,
  FaTimesCircle, FaUserCheck, FaBuilding, FaGraduationCap
} from 'react-icons/fa';

import {
  MdDashboard, MdAssignment, MdPayment, MdPeople, MdReports,
  MdNotifications, MdSettings, MdLogout, MdMenu, MdClose,
  MdSearch, MdFilterList, MdRefresh, MdAdd, MdEdit, MdDelete,
  MdVisibility, MdPhone, MdEmail, MdLocationOn, MdDescription,
  MdDownload, MdUpload, MdSave, MdCancel, MdCheck, MdWarning,
  MdError, MdInfo, MdSuccess
} from 'react-icons/md';

import {
  HiHome, HiClipboardList, HiClock, HiExclamation, HiChartBar,
  HiUser, HiUsers, HiPhone, HiMail, HiLocationMarker, HiDocument,
  HiDownload, HiFilter, HiRefresh, HiPlus, HiX, HiArrowLeft,
  HiCalendar, HiCog, HiLogout, HiMenu, HiChevronDown, HiChevronUp,
  HiCheck, HiExclamationTriangle, HiInformationCircle
} from 'react-icons/hi';

export const icons = {
  // Navigation
  home: FaHome,
  dashboard: MdDashboard,
  assignedLoans: FaClipboardList,
  history: FaHistory,
  pending: FaExclamationTriangle,
  performance: FaChartBar,
  profile: FaUser,
  settings: FaCog,
  logout: FaSignOutAlt,
  
  // Actions
  search: FaSearch,
  filter: FaFilter,
  refresh: FaSync,
  add: FaPlus,
  edit: FaEdit,
  delete: FaTrash,
  view: FaEye,
  close: FaTimes,
  back: FaArrowLeft,
  menu: FaBars,
  save: MdSave,
  cancel: MdCancel,
  
  // Data
  users: FaUsers,
  customer: FaUser,
  phone: FaPhone,
  email: FaEnvelope,
  address: FaMapMarkerAlt,
  document: FaFileAlt,
  calendar: FaCalendarAlt,
  clock: FaClock,
  money: FaDollarSign,
  
  // Status
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  error: FaTimesCircle,
  info: FaInfoCircle,
  check: FaCheck,
  
  // Roles
  admin: FaCrown,
  staff: FaUserTie,
  agent: FaBullseye,
  userPlus: FaUserPlus,
  userCheck: FaUserCheck,
  
  // UI
  chevronDown: FaChevronDown,
  chevronUp: FaChevronUp,
  bell: FaBell,
  download: FaDownload,
  
  // Emojis replacement
  wave: FaHandPaper,
  briefcase: FaBuilding,
  graduation: FaGraduationCap,
  chart: FaChartLine,
  notification: FaBell,
  collection: FaMoneyBillWave
};

// Helper function to get icon component
export const getIcon = (iconName, props = {}) => {
  const IconComponent = icons[iconName];
  return IconComponent ? <IconComponent {...props} /> : null;
};