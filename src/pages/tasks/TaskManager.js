import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Users, 
  MapPin, 
  Home, 
  Zap, 
  Car, 
  ShoppingCart,
  Phone,
  Shield,
  Wifi,
  Droplets,
  Flame,
  ExternalLink,
  User,
  Calendar,
  Bell,
  Play,
  Pause,
  Square,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { useAuth } from '../../contexts/AuthContext';
import { taskAPI, moveAPI } from '../../lib/api';
import { showSuccess, showError } from '../../lib/snackbar';

const TaskManager = () => {
  const { user } = useAuth();
  const [currentMove, setCurrentMove] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'general',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    location: 'current'
  });

  // Collaborator invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'helper'
  });

  // Predefined task templates
  const taskTemplates = {
    current: [
      {
        category: 'council',
        title: 'Council Kerbside Booking',
        description: 'Book council kerbside collection for unwanted items',
        icon: ExternalLink,
        color: 'blue',
        isExternal: true,
        externalUrl: 'https://www.council.nsw.gov.au/kerbside'
      },
      {
        category: 'address_change',
        title: 'Address Change Checklist',
        description: 'Update address with banks, insurance, subscriptions',
        icon: MapPin,
        color: 'green',
        subtasks: [
          'Bank and credit cards',
          'Insurance companies',
          'Employer/HR department',
          'Tax office',
          'Electoral roll',
          'Subscriptions and memberships'
        ]
      },
      {
        category: 'first_night',
        title: 'First Night Bag - Adults',
        description: 'Pack essentials for the first night in new home',
        icon: Home,
        color: 'purple',
        subtasks: [
          'Change of clothes',
          'Toiletries',
          'Medications',
          'Phone chargers',
          'Important documents',
          'Snacks and water'
        ]
      },
      {
        category: 'first_night',
        title: 'First Night Bag - Children',
        description: 'Pack children\'s essentials and comfort items',
        icon: User,
        color: 'pink',
        subtasks: [
          'Favorite toys/comfort items',
          'Extra clothes',
          'Diapers/supplies',
          'Snacks and drinks',
          'Entertainment (books, tablets)',
          'Any special medications'
        ]
      },
      {
        category: 'first_night',
        title: 'First Night Bag - Pets',
        description: 'Prepare pet essentials for moving day',
        icon: User,
        color: 'orange',
        subtasks: [
          'Food and water bowls',
          'Pet food for 2-3 days',
          'Leash and collar with ID',
          'Favorite toys/blankets',
          'Litter box (cats)',
          'Medications and vet records'
        ]
      }
    ],
    utilities: [
      {
        category: 'electricity',
        title: 'Electricity Service',
        description: 'Disconnect current and connect new electricity service',
        icon: Zap,
        color: 'yellow',
        subtasks: [
          'Contact current provider for disconnection',
          'Research providers for new address',
          'Schedule connection at new property',
          'Submit meter readings'
        ]
      },
      {
        category: 'gas',
        title: 'Gas Service',
        description: 'Transfer or setup gas connection',
        icon: Flame,
        color: 'red',
        subtasks: [
          'Contact current gas provider',
          'Arrange disconnection',
          'Setup new connection',
          'Schedule safety inspection'
        ]
      },
      {
        category: 'water',
        title: 'Water Service',
        description: 'Transfer water and sewerage services',
        icon: Droplets,
        color: 'blue',
        subtasks: [
          'Contact water authority',
          'Arrange final reading',
          'Setup account for new address',
          'Update payment details'
        ]
      },
      {
        category: 'internet',
        title: 'Internet Service',
        description: 'Transfer or setup internet connection',
        icon: Wifi,
        color: 'green',
        subtasks: [
          'Contact current ISP',
          'Check availability at new address',
          'Schedule installation',
          'Return old equipment if needed'
        ]
      },
      {
        category: 'phone',
        title: 'Phone Service',
        description: 'Transfer landline and mobile services',
        icon: Phone,
        color: 'gray',
        subtasks: [
          'Contact phone provider',
          'Update service address',
          'Port numbers if changing providers',
          'Update emergency contacts'
        ]
      },
      {
        category: 'insurance',
        title: 'Insurance Updates',
        description: 'Update home, contents, and vehicle insurance',
        icon: Shield,
        color: 'purple',
        subtasks: [
          'Home/contents insurance',
          'Vehicle insurance',
          'Update policy addresses',
          'Review coverage levels',
          'Get quotes for new area'
        ]
      }
    ],
    vehicles: [
      {
        category: 'registration',
        title: 'Vehicle Registration Update',
        description: 'Update vehicle registration with new address',
        icon: Car,
        color: 'blue',
        subtasks: [
          'Update registration details',
          'Change license address',
          'Update insurance',
          'Notify finance company if applicable'
        ]
      }
    ],
    garage_sale: [
      {
        category: 'garage_sale',
        title: 'Garage Sale Planning',
        description: 'Organize garage sale to reduce moving load',
        icon: ShoppingCart,
        color: 'green',
        subtasks: [
          'Sort items to sell',
          'Price items',
          'Advertise sale',
          'Prepare change and bags',
          'Plan sale layout'
        ]
      }
    ]
  };

  useEffect(() => {
    loadTaskData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      
      // Get user's moves first
      const movesResponse = await moveAPI.getUserMoves();
      if (!movesResponse.success || !movesResponse.data || movesResponse.data.length === 0) {
        showError('No moves found. Please create a move first.');
        return;
      }
      
      const move = movesResponse.data[0];
      setCurrentMove(move);
      
      // Get tasks for this move
      const tasksResponse = await taskAPI.getTasks(move.id);
      if (tasksResponse.success) {
        setTasks(tasksResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading task data:', error);
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTaskFromTemplate = async (template, location = 'current') => {
    if (!currentMove) return;

    try {
      const taskData = {
        move_id: currentMove.id,
        title: template.title,
        description: template.description,
        category: template.category,
        location: location,
        priority: 'medium',
        assigned_to: user.id,
        subtasks: template.subtasks || [],
        is_external: template.isExternal || false,
        external_url: template.externalUrl || null
      };

      const response = await taskAPI.createTask(taskData);
      if (response.success) {
        setTasks(prev => [...prev, response.data]);
        showSuccess('Task created successfully!');
      }
    } catch (error) {
      showError('Failed to create task');
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await taskAPI.updateTask(taskId, { 
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null
      });
      
      if (response.success) {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
        showSuccess(`Task marked as ${!task.completed ? 'completed' : 'incomplete'}!`);
      }
    } catch (error) {
      showError('Failed to update task');
    }
  };

  const addCustomTask = async () => {
    if (!currentMove || !newTask.title.trim()) return;

    try {
      const taskData = {
        move_id: currentMove.id,
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        location: newTask.location,
        priority: newTask.priority,
        assigned_to: newTask.assignedTo || user.id,
        due_date: newTask.dueDate || null
      };

      const response = await taskAPI.createTask(taskData);
      if (response.success) {
        setTasks(prev => [...prev, response.data]);
        setNewTask({
          title: '',
          description: '',
          category: 'general',
          assignedTo: '',
          dueDate: '',
          priority: 'medium',
          location: 'current'
        });
        setIsAddTaskModalOpen(false);
        showSuccess('Custom task created successfully!');
      }
    } catch (error) {
      showError('Failed to create custom task');
    }
  };

  const startTimer = (taskId) => {
    if (activeTimer && activeTimer !== taskId) {
      // Stop current timer
      stopTimer();
    }
    setActiveTimer(taskId);
    setTimerSeconds(0);
  };

  const stopTimer = () => {
    if (activeTimer) {
      // TODO: Save timer data to backend
      showSuccess(`Timer stopped: ${formatTime(timerSeconds)}`);
    }
    setActiveTimer(null);
    setTimerSeconds(0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const inviteCollaborator = async () => {
    if (!currentMove || !inviteForm.email.trim()) return;

    try {
      const response = await moveAPI.inviteCollaborator({
        move_id: currentMove.id,
        email: inviteForm.email,
        first_name: inviteForm.firstName,
        last_name: inviteForm.lastName,
        role: inviteForm.role,
        permissions: 'view_tasks'
      });

      if (response.success) {
        setInviteForm({ email: '', firstName: '', lastName: '', role: 'helper' });
        setIsInviteModalOpen(false);
        showSuccess('Collaborator invited successfully!');
      }
    } catch (error) {
      showError('Failed to invite collaborator');
    }
  };

  const getTasksByLocation = (location) => {
    return tasks.filter(task => task.location === location);
  };

  const renderTaskCard = (task) => (
    <Card key={task.id} className={`transition-all hover:shadow-md ${task.completed ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => toggleTask(task.id)}
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
            </button>
            
            <div className="flex-1">
              <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  {task.subtasks.map((subtask, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      {subtask}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {task.is_external && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(task.external_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            
            {/* Timer controls */}
            <div className="flex items-center space-x-1">
              {activeTimer === task.id ? (
                <>
                  <span className="text-xs font-mono">{formatTime(timerSeconds)}</span>
                  <Button size="sm" variant="outline" onClick={stopTimer}>
                    <Square className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => startTimer(task.id)}>
                  <Play className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {task.assigned_to && task.assigned_to !== user.id && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <User className="w-3 h-3 mr-1" />
            Assigned to collaborator
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTemplateCard = (template, location) => (
    <Card key={template.title} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${template.color}-100`}>
              <template.icon className={`w-5 h-5 text-${template.color}-600`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{template.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              {template.subtasks && (
                <p className="text-xs text-gray-500 mt-2">
                  {template.subtasks.length} subtasks included
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => createTaskFromTemplate(template, location)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!currentMove) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Move Found</h2>
          <p className="text-gray-600 mb-6">Please create a move first to manage tasks.</p>
          <Button onClick={() => window.location.href = '/my-move'}>
            Create Move
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600 mt-1">Organize and track all your moving tasks</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsInviteModalOpen(true)} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Collaborator
              </Button>
              <Button onClick={() => setIsAddTaskModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Timer Display */}
      {activeTimer && (
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Timer className="w-5 h-5" />
                <span className="font-semibold">Timer Active</span>
                <span className="font-mono text-lg">{formatTime(timerSeconds)}</span>
              </div>
              <Button size="sm" variant="outline" onClick={stopTimer} className="text-blue-600">
                Stop Timer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Address</TabsTrigger>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="garage_sale">Garage Sale</TabsTrigger>
          </TabsList>

          {/* Current Address Tasks */}
          <TabsContent value="current" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Current Address Tasks</h2>
              
              {/* Existing Tasks */}
              <div className="grid gap-4 mb-8">
                {getTasksByLocation('current').map(renderTaskCard)}
              </div>

              {/* Task Templates */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Task Templates</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {taskTemplates.current.map(template => renderTemplateCard(template, 'current'))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Utilities Tasks */}
          <TabsContent value="utilities" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Utilities Management</h2>
              <p className="text-gray-600 mb-6">Manage all utility connections and transfers for your move.</p>
              
              {/* Existing Tasks */}
              <div className="grid gap-4 mb-8">
                {getTasksByLocation('utilities').map(renderTaskCard)}
              </div>

              {/* Utility Templates */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {taskTemplates.utilities.map(template => renderTemplateCard(template, 'utilities'))}
              </div>
            </div>
          </TabsContent>

          {/* Vehicles Tasks */}
          <TabsContent value="vehicles" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Vehicle Management</h2>
              
              {/* Existing Tasks */}
              <div className="grid gap-4 mb-8">
                {getTasksByLocation('vehicles').map(renderTaskCard)}
              </div>

              {/* Vehicle Templates */}
              <div className="grid md:grid-cols-2 gap-4">
                {taskTemplates.vehicles.map(template => renderTemplateCard(template, 'vehicles'))}
              </div>
            </div>
          </TabsContent>

          {/* Garage Sale Tasks */}
          <TabsContent value="garage_sale" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Garage Sale Planning</h2>
              
              {/* Existing Tasks */}
              <div className="grid gap-4 mb-8">
                {getTasksByLocation('garage_sale').map(renderTaskCard)}
              </div>

              {/* Garage Sale Templates */}
              <div className="grid md:grid-cols-2 gap-4">
                {taskTemplates.garage_sale.map(template => renderTemplateCard(template, 'garage_sale'))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Custom Task Modal */}
      <Modal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Custom Task</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="packing">Packing</option>
                  <option value="utilities">Utilities</option>
                  <option value="address_change">Address Change</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={newTask.location}
                  onChange={(e) => setNewTask(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="current">Current Address</option>
                  <option value="new">New Address</option>
                  <option value="utilities">Utilities</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="garage_sale">Garage Sale</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsAddTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCustomTask} disabled={!newTask.title.trim()}>
              Add Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invite Collaborator Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invite Collaborator</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="family">Family Member</option>
                <option value="friend">Friend</option>
                <option value="helper">Helper</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Collaborators will be able to view and help with tasks, 
              but won't see budget information.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={inviteCollaborator} disabled={!inviteForm.email.trim()}>
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskManager;

