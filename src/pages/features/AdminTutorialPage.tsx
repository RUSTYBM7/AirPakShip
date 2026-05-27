/**
 * AirPak Express - Admin Tutorial & Feature Guide
 * Comprehensive guide for administrators to learn all features
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, ChevronRight, ChevronDown, Search, Play, CheckCircle, Clock,
  Users, Package, Truck, FileText, Settings, Shield, Bell, Zap, Mail,
  BarChart3, CreditCard, Globe, Lock, Eye, Edit, Trash2, Plus, Star,
  MessageSquare, Headphones, AlertTriangle, Check, X, ArrowRight, Video,
  Bookmark, BookmarkCheck, ExternalLink
} from 'lucide-react';

interface TutorialSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  lessons: TutorialLesson[];
}

interface TutorialLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  steps: string[];
  tips: string[];
}

const TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Play,
    description: 'Learn the basics of the AirPak Admin Portal',
    lessons: [
      {
        id: 'gs-1',
        title: 'Dashboard Overview',
        description: 'Understand your dashboard layout and key metrics',
        duration: '5 min',
        completed: true,
        videoUrl: '/tutorials/dashboard-overview',
        steps: [
          'Navigate to Dashboard from the sidebar',
          'Review key metrics: Total Shipments, Revenue, Active Users',
          'Check real-time activity feed',
          'View pending approvals and alerts'
        ],
        tips: [
          'Pin frequently used widgets for quick access',
          'Use date filters to view historical data',
          'Export dashboard reports in CSV or PDF format'
        ]
      },
      {
        id: 'gs-2',
        title: 'Navigation & Interface',
        description: 'Master the sidebar navigation and interface elements',
        duration: '3 min',
        completed: true,
        steps: [
          'Use the sidebar to access all admin sections',
          'Collapse/expand the sidebar for more workspace',
          'Use keyboard shortcuts for quick navigation',
          'Access quick actions from the top bar'
        ],
        tips: [
          'Press "?" to see all keyboard shortcuts',
          'Star frequently visited pages for quick access'
        ]
      },
      {
        id: 'gs-3',
        title: 'Account & Security Setup',
        description: 'Configure your admin account security settings',
        duration: '7 min',
        completed: false,
        steps: [
          'Enable two-factor authentication (2FA)',
          'Set up backup authentication methods',
          'Configure session timeout settings',
          'Review active sessions and devices'
        ],
        tips: [
          'Always enable 2FA for maximum security',
          'Save backup codes in a secure location'
        ]
      }
    ]
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: Users,
    description: 'Complete guide to managing users, roles, and permissions',
    lessons: [
      {
        id: 'um-1',
        title: 'Creating & Managing Users',
        description: 'How to add, edit, and manage user accounts',
        duration: '8 min',
        completed: false,
        steps: [
          'Navigate to Users section in Administration',
          'Click "Add User" button to create new accounts',
          'Fill in user details: name, email, role, tier',
          'Set initial permissions and access levels',
          'Send welcome email to new users'
        ],
        tips: [
          'Use bulk import for adding multiple users',
          'Set default tier based on user type (Bronze for new customers)',
          'Always verify email addresses before granting access'
        ]
      },
      {
        id: 'um-2',
        title: 'User Roles & Permissions',
        description: 'Understanding and assigning roles',
        duration: '6 min',
        completed: false,
        steps: [
          'Open Roles & Permissions section',
          'Review available roles: Super Admin, Admin, Manager, Staff, Customer',
          'Assign appropriate roles based on responsibilities',
          'Customize permissions within each role',
          'Test role permissions before deployment'
        ],
        tips: [
          'Follow principle of least privilege',
          'Regularly audit role assignments',
          'Document role changes for compliance'
        ]
      },
      {
        id: 'um-3',
        title: 'Verifying Users',
        description: 'Identity verification process and benefits',
        duration: '5 min',
        completed: false,
        steps: [
          'Locate unverified users in the user list',
          'Review verification documents submitted',
          'Approve or reject verification requests',
          'Send verification reminder to pending users'
        ],
        tips: [
          'Verified users get higher trust scores',
          'Enable auto-verification for pre-approved domains',
          'Keep verification records for audits'
        ]
      },
      {
        id: 'um-4',
        title: 'Blocking & Suspending Users',
        description: 'Security actions for account management',
        duration: '5 min',
        completed: false,
        steps: [
          'Identify users requiring action: suspicious activity, policy violations',
          'Use Block for permanent account suspension',
          'Use Suspend for temporary restrictions',
          'Document reason for blocking in user notes',
          'Communicate with user via secure channels'
        ],
        tips: [
          'Block only after warning attempts',
          'Include reason in block notice to user',
          'Keep audit trail of all security actions'
        ]
      },
      {
        id: 'um-5',
        title: 'Placing Users on Hold',
        description: 'Temporary account restrictions and documentation',
        duration: '4 min',
        completed: false,
        steps: [
          'Select user to place on hold',
          'Choose hold reason from preset options',
          'Set hold duration (days)',
          'Add custom notice to display to user',
          'Remove hold when resolved'
        ],
        tips: [
          'Common hold reasons: Pending documentation, Payment issues, Verification required',
          'Custom notices help users understand what to do',
          'Auto-remove holds when conditions are met'
        ]
      },
      {
        id: 'um-6',
        title: 'Custom Notices & Notices',
        description: 'Communicating important information to users',
        duration: '4 min',
        completed: false,
        steps: [
          'Select user for notice',
          'Choose notice template or create custom',
          'Preview notice content',
          'Send notice to user dashboard and email',
          'Track notice delivery and read status'
        ],
        tips: [
          'Use templates for consistent communication',
          'Personalize notices with user name and specific details',
          'Archive important notices for reference'
        ]
      },
      {
        id: 'um-7',
        title: 'Tier Upgrades',
        description: 'Managing customer loyalty tiers',
        duration: '5 min',
        completed: false,
        steps: [
          'Understand tier system: Bronze, Silver, Gold, Platinum',
          'Review tier upgrade criteria',
          'Initiate manual tier upgrade',
          'Confirm upgrade and send notification',
          'Verify benefits are applied correctly'
        ],
        tips: [
          'Gold and Platinum users get priority support',
          'Consider volume and frequency for upgrades',
          'Send upgrade celebration emails'
        ]
      }
    ]
  },
  {
    id: 'shipment-tracking',
    title: 'Shipment & Tracking',
    icon: Truck,
    description: 'Managing shipments and real-time tracking',
    lessons: [
      {
        id: 'st-1',
        title: 'Creating Shipments',
        description: 'Step-by-step shipment creation process',
        duration: '7 min',
        completed: false,
        steps: [
          'Click "New Shipment" button',
          'Enter sender and receiver details',
          'Select service type (Express, Standard, Economy)',
          'Add package details and contents',
          'Set insurance and special handling',
          'Generate tracking number and label'
        ],
        tips: [
          'Double-check customs declarations for international shipments',
          'Use address autocomplete for accuracy',
          'Save frequently used addresses'
        ]
      },
      {
        id: 'st-2',
        title: 'Real-Time Tracking',
        description: 'Monitoring shipments with live updates',
        duration: '5 min',
        completed: false,
        steps: [
          'Enter tracking number in search bar',
          'View shipment timeline and current status',
          'Check location on map (if available)',
          'Review all tracking events',
          'View estimated delivery time'
        ],
        tips: [
          'Enable notifications for status changes',
          'Share tracking links with customers',
          'Resolve tracking issues promptly'
        ]
      },
      {
        id: 'st-3',
        title: 'Managing Shipment Status',
        description: 'Updating and modifying shipment states',
        duration: '6 min',
        completed: false,
        steps: [
          'Locate shipment in Shipments list',
          'Update status: Created, Picked Up, In Transit, Out for Delivery, Delivered',
          'Add tracking events manually if needed',
          'Handle exceptions: Failed Delivery, Return to Sender',
          'Update customer notifications'
        ],
        tips: [
          'Always record exceptions with notes',
          'Flag shipments needing customer follow-up',
          'Use bulk status updates for efficiency'
        ]
      }
    ]
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    icon: Zap,
    description: 'Leveraging AI tools for efficiency',
    lessons: [
      {
        id: 'ai-1',
        title: 'AI Document Generator',
        description: 'Creating shipping documents with AI assistance',
        duration: '8 min',
        completed: false,
        steps: [
          'Navigate to AI Documents section',
          'Select document type (Air Waybill, Invoice, etc.)',
          'Choose shipments to include',
          'Configure language and branding options',
          'Enable AI enhancements (smart descriptions, compliance check)',
          'Generate and preview document',
          'Download PDF or send to customer'
        ],
        tips: [
          'Enable all AI enhancements for best results',
          'Use zoom controls (+) (-) to adjust preview size',
          'Save frequently used templates'
        ]
      },
      {
        id: 'ai-2',
        title: 'AI Invoices',
        description: 'Generating professional invoices with AI',
        duration: '6 min',
        completed: false,
        steps: [
          'Select shipments or customers',
          'Choose invoice template style',
          'Add line items manually or from shipments',
          'Apply discounts and taxes',
          'Preview and edit AI-generated descriptions',
          'Export as PDF or send via email'
        ],
        tips: [
          'Use AI suggestions for professional descriptions',
          'Keep invoice records for accounting'
        ]
      },
      {
        id: 'ai-3',
        title: 'AI Creative Studio',
        description: 'Creating marketing materials with AI-powered design',
        duration: '10 min',
        completed: false,
        steps: [
          'Navigate to AI Creative Studio',
          'Select template or start blank canvas',
          'Add elements: text, shapes, images',
          'Use AI suggestions for layout',
          'Apply brand colors and fonts',
          'Export for social media or print'
        ],
        tips: [
          'Use templates as starting points',
          'Maintain brand consistency',
          'Export in multiple formats for flexibility'
        ]
      },
      {
        id: 'ai-4',
        title: 'AI Analytics Dashboard',
        description: 'Understanding business insights from AI',
        duration: '7 min',
        completed: false,
        steps: [
          'Access AI Analyst section',
          'View key metrics and trends',
          'Explore AI-generated insights',
          'Filter by date range, region, service type',
          'Export reports for presentations'
        ],
        tips: [
          'Daily check-in for operational awareness',
          'Use insights for strategic planning',
          'Share dashboard with stakeholders'
        ]
      }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media & AI Studio',
    icon: Globe,
    description: 'Creating and scheduling social media content',
    lessons: [
      {
        id: 'sm-1',
        title: 'Gemini AI Integration',
        description: 'Using Gemini AI for social media content creation',
        duration: '8 min',
        completed: false,
        steps: [
          'Navigate to AI Creative Studio',
          'Select "Generate with Gemini" option',
          'Enter content topic or keywords',
          'Choose platform (Facebook, Instagram, LinkedIn, Twitter)',
          'Select content style and tone',
          'Review and edit AI suggestions',
          'Schedule or publish directly'
        ],
        tips: [
          'Gemini creates platform-specific content',
          'Customize tone for different audiences',
          'Review for brand voice consistency'
        ]
      },
      {
        id: 'sm-2',
        title: 'Creating Social Posts',
        description: 'Design engaging social media posts',
        duration: '7 min',
        completed: false,
        steps: [
          'Select post type: Image, Carousel, Story, Video',
          'Choose brand templates',
          'Add custom graphics using canvas editor',
          'Write compelling captions',
          'Add hashtags and mentions',
          'Preview for each platform',
          'Schedule for optimal posting times'
        ],
        tips: [
          'Use holiday/event-specific templates',
          'A/B test different content formats',
          'Track engagement metrics'
        ]
      },
      {
        id: 'sm-3',
        title: 'Content Calendar',
        description: 'Planning and scheduling content',
        duration: '6 min',
        completed: false,
        steps: [
          'Access content calendar view',
          'Drag and drop posts to schedule',
          'View scheduled posts by platform',
          'Edit or reschedule as needed',
          'View past performance metrics'
        ],
        tips: [
          'Plan content 2-4 weeks ahead',
          'Balance post types across platforms',
          'Use analytics to optimize timing'
        ]
      }
    ]
  },
  {
    id: 'communications',
    title: 'Communications & Support',
    icon: MessageSquare,
    description: 'Managing customer communications',
    lessons: [
      {
        id: 'com-1',
        title: 'Email System',
        description: 'Sending professional emails to users',
        duration: '5 min',
        completed: false,
        steps: [
          'Navigate to Email System',
          'Select recipients (individual, group, all)',
          'Choose or create email template',
          'Customize content for your needs',
          'Preview email appearance',
          'Send immediately or schedule'
        ],
        tips: [
          'Use templates for consistency',
          'Personalize emails with merge tags',
          'Track open rates and clicks'
        ]
      },
      {
        id: 'com-2',
        title: 'Support Tickets',
        description: 'Managing customer support requests',
        duration: '7 min',
        completed: false,
        steps: [
          'View all support tickets in queue',
          'Filter by status: Open, In Progress, Escalated',
          'Assign tickets to available staff',
          'Respond with helpful solutions',
          'Escalate complex issues',
          'Close resolved tickets'
        ],
        tips: [
          'First response within 4 hours',
          'Use template responses for common issues',
          'Escalate to supervisors when needed'
        ]
      },
      {
        id: 'com-3',
        title: 'Real-Time P2P Chat',
        description: 'Direct communication between admins and users',
        duration: '5 min',
        completed: false,
        steps: [
          'Open chat panel from sidebar or user profile',
          'Select user to start conversation',
          'Send text, file, or quick replies',
          'View chat history for context',
          'Receive real-time notifications',
          'End or archive conversations'
        ],
        tips: [
          'Use for urgent matters requiring quick response',
          'Maintain professional tone in all chats',
          'Keep detailed chat logs for records'
        ]
      }
    ]
  },
  {
    id: 'security-audit',
    title: 'Security & Compliance',
    icon: Shield,
    description: 'Maintaining platform security',
    lessons: [
      {
        id: 'sec-1',
        title: 'Audit Logs',
        description: 'Tracking all administrative actions',
        duration: '5 min',
        completed: false,
        steps: [
          'Access Audit Logs section',
          'Filter by date, user, action type',
          'Review action details and timestamps',
          'Export logs for compliance reports',
          'Set up alerts for suspicious activities'
        ],
        tips: [
          'Weekly audit review recommended',
          'Flag unusual patterns immediately',
          'Keep logs for regulatory compliance'
        ]
      },
      {
        id: 'sec-2',
        title: 'AI Approvals',
        description: 'Reviewing AI-generated content before publishing',
        duration: '4 min',
        completed: false,
        steps: [
          'Check approval queue in AI section',
          'Review AI-generated drafts',
          'Approve, modify, or reject suggestions',
          'Add notes for future reference',
          'Save approved templates'
        ],
        tips: [
          'Review all AI content before going live',
          'Provide feedback to improve AI suggestions',
          'Balance speed with quality control'
        ]
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Features',
    icon: Settings,
    description: 'Automation, API, and advanced configuration',
    lessons: [
      {
        id: 'adv-1',
        title: 'Automation Rules',
        description: 'Setting up automated workflows',
        duration: '8 min',
        completed: false,
        steps: [
          'Navigate to Automation Rules',
          'Create new rule with triggers',
          'Define conditions for rule activation',
          'Set automated actions',
          'Test rule with sample data',
          'Activate and monitor rule'
        ],
        tips: [
          'Start with simple rules',
          'Test extensively before full activation',
          'Review rule performance regularly'
        ]
      },
      {
        id: 'adv-2',
        title: 'API Playground',
        description: 'Testing and using API endpoints',
        duration: '10 min',
        completed: false,
        steps: [
          'Access API documentation',
          'Generate API keys',
          'Test endpoints in playground',
          'Review request/response format',
          'Implement in your applications'
        ],
        tips: [
          'Use sandbox for testing',
          'Respect rate limits',
          'Keep API keys secure'
        ]
      },
      {
        id: 'adv-3',
        title: 'AutoPilot Mode',
        description: 'Fully automated operations management',
        duration: '7 min',
        completed: false,
        steps: [
          'Enable AutoPilot from Settings',
          'Configure automation tolerance levels',
          'Set approval thresholds',
          'Monitor automated decisions',
          'Override when necessary'
        ],
        tips: [
          'Build confidence gradually',
          'Review all automated decisions daily',
          'Adjust thresholds based on performance'
        ]
      }
    ]
  }
];

const AdminTutorialPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  // Calculate progress
  const totalLessons = TUTORIAL_SECTIONS.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedLessons = TUTORIAL_SECTIONS.reduce((acc, section) =>
    acc + section.lessons.filter(l => l.completed).length, 0);
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  // Filter sections based on search
  const filteredSections = TUTORIAL_SECTIONS.map(section => ({
    ...section,
    lessons: section.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.lessons.length > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Book className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Tutorial Center</h1>
            <p className="text-slate-400 mt-1">Learn how to use all AirPak Admin features</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-3">Your Learning Progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  />
                </div>
              </div>
              <span className="text-xl font-bold text-white">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{completedLessons}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{totalLessons - completedLessons}</p>
              <p className="text-xs text-slate-400">Remaining</p>
            </div>
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
              <p className="text-2xl font-bold text-white">{totalLessons}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'completed', 'in-progress'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Topics' : tab === 'completed' ? 'Completed' : 'In Progress'}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tutorial Sections */}
      <div className="space-y-4">
        {filteredSections.map((section, sectionIdx) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);
          const completedInSection = section.lessons.filter(l => l.completed).length;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.05 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                    <p className="text-slate-400 text-sm">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">
                    {completedInSection}/{section.lessons.length} completed
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Lessons */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-800"
                  >
                    <div className="p-4 space-y-2">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`bg-slate-800/30 rounded-xl overflow-hidden ${
                            lesson.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-slate-600'
                          }`}
                        >
                          {/* Lesson Header */}
                          <button
                            onClick={() => toggleLesson(lesson.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                              )}
                              <div className="text-left">
                                <h4 className="text-white font-medium">{lesson.title}</h4>
                                <p className="text-slate-400 text-sm">{lesson.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-slate-500 text-sm">
                                <Clock className="w-4 h-4" />
                                {lesson.duration}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(lesson.id);
                                }}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                              >
                                {bookmarkedLessons.has(lesson.id) ? (
                                  <BookmarkCheck className="w-4 h-4 text-yellow-400" />
                                ) : (
                                  <Bookmark className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              {expandedLessons.has(lesson.id) ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {/* Lesson Content */}
                          <AnimatePresence>
                            {expandedLessons.has(lesson.id) && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="border-t border-slate-700/50 overflow-hidden"
      >
                                <div className="p-4 space-y-4">
                                  {/* Steps */}
                                  <div>
                                    <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                      <Play className="w-4 h-4 text-blue-400" />
                                      Steps to Complete
                                    </h5>
                                    <ol className="space-y-2">
                                      {lesson.steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                                          <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
                                            {idx + 1}
                                          </span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>

                                  {/* Tips */}
                                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                    <h5 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                                      <Star className="w-4 h-4" />
                                      Pro Tips
                                    </h5>
                                    <ul className="space-y-1">
                                      {lesson.tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-yellow-200/80">
                                          <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-3 pt-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                      <Play className="w-4 h-4" />
                                      Start Lesson
                                    </button>
                                    {lesson.videoUrl && (
                                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                        <Video className="w-4 h-4" />
                                        Watch Video
                                      </button>
                                    )}
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                      <ExternalLink className="w-4 h-4" />
                                      Go to Feature
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Help & Support */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Need Help?</h3>
              <p className="text-slate-400 text-sm">Contact the support team for additional guidance</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTutorialPage;
