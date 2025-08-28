import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Calendar, AlertCircle, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { formatDate, calculateDaysUntil } from '../../lib/utils'
import { timelineAPI, moveAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

const categoryColors = {
  logistics: 'from-blue-500 to-blue-600',
  preparation: 'from-green-500 to-green-600',
  supplies: 'from-yellow-500 to-yellow-600',
  utilities: 'from-purple-500 to-purple-600',
  address_change: 'from-orange-500 to-orange-600',
  packing: 'from-red-500 to-red-600',
  moving_day: 'from-emerald-500 to-emerald-600'
}

const categoryIcons = {
  logistics: '🚛',
  preparation: '📋',
  supplies: '📦',
  utilities: '⚡',
  address_change: '📬',
  packing: '📦',
  moving_day: '🎉'
}

export default function Timeline() {
  const [timelineEvents, setTimelineEvents] = useState([])
  const [currentMove, setCurrentMove] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const moveDate = currentMove ? new Date(currentMove.move_date) : new Date()
  const today = new Date()
  const daysUntilMove = currentMove ? calculateDaysUntil(currentMove.move_date) : 0
  const totalTasks = timelineEvents.length
  const completedCount = timelineEvents.filter(task => task.completed).length
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0

  // Load timeline data on component mount
  useEffect(() => {
    loadTimelineData()
  }, [])

  const loadTimelineData = async () => {
    try {
      setLoading(true)
      
      // Get user's moves first
      const movesResponse = await moveAPI.getUserMoves()
      if (!movesResponse.success || !movesResponse.data || movesResponse.data.length === 0) {
        showError('No moves found. Please create a move first.')
        return
      }
      
      // Use the first move (or you could let user select)
      const move = movesResponse.data[0]
      setCurrentMove(move)
      
      // Get timeline events for this move
      const timelineResponse = await timelineAPI.getTimelineEvents(move.id)
      if (timelineResponse.success) {
        setTimelineEvents(timelineResponse.data || [])
      } else {
        showError('Failed to load timeline events')
      }
    } catch (error) {
      console.error('Error loading timeline data:', error)
      showError('Failed to load timeline data')
    } finally {
      setLoading(false)
    }
  }

  const getTaskDate = (daysFromMove) => {
    const taskDate = new Date(moveDate)
    taskDate.setDate(taskDate.getDate() + daysFromMove)
    return taskDate
  }

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed'
    const taskDate = getTaskDate(task.daysFromMove)
    if (taskDate < today) return 'overdue'
    if (taskDate.toDateString() === today.toDateString()) return 'today'
    return 'upcoming'
  }

  const toggleTask = async (taskId) => {
    try {
      const task = timelineEvents.find(t => t.id === taskId)
      if (!task || task.completed) return
      
      const response = await timelineAPI.updateTaskStatus(taskId, true)
      if (response.success) {
        // Update local state
        setTimelineEvents(prev => 
          prev.map(t => t.id === taskId ? { ...t, completed: true } : t)
        )
        showSuccess('Task marked as completed!')
      } else {
        showError('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      showError('Failed to update task status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your timeline...</p>
        </div>
      </div>
    )
  }

  if (!currentMove) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Move Found</h2>
          <p className="text-gray-600 mb-6">Please create a move first to view your timeline.</p>
          <Button onClick={() => window.location.href = '/my-move'}>
            Create Move
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Landing Page Style */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Moving Timeline</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your personalized roadmap to a stress-free move
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-primary-600">{daysUntilMove}</div>
                <div className="text-sm text-gray-600">days to go</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-primary-600">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-600">complete</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-primary-600">{completedCount}/{totalTasks}</div>
                <div className="text-sm text-gray-600">tasks done</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progress Overview */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Overall Progress</CardTitle>
                <CardDescription className="text-base">
                  You're doing great! Keep up the momentum.
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{Math.round(progress)}%</div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  On track
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-4 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Started planning</span>
              <span className="font-semibold">Moving day!</span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-400 rounded-full"></div>

          <div className="space-y-8">
            {timelineEvents.map((task, index) => {
              const status = getTaskStatus(task)
              const taskDate = getTaskDate(task.daysFromMove)
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start space-x-6"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl transition-all hover:scale-110 ${
                        task.completed
                          ? 'bg-green-500 border-green-400 shadow-lg shadow-green-200'
                          : status === 'overdue'
                          ? 'bg-red-100 border-red-300 hover:bg-red-200'
                          : status === 'today'
                          ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200 animate-pulse'
                          : 'bg-white border-gray-300 hover:border-primary-400 shadow-lg'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      ) : (
                        <span>{categoryIcons[task.category]}</span>
                      )}
                    </button>
                    
                    {/* Status indicator */}
                    {status === 'today' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {status === 'overdue' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Task card */}
                  <Card className={`flex-1 border-2 transition-all hover:shadow-xl ${
                    task.completed 
                      ? 'border-green-200 bg-green-50' 
                      : status === 'today'
                      ? 'border-yellow-300 bg-yellow-50 shadow-lg'
                      : status === 'overdue'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className={`text-xl mb-2 ${task.completed ? 'line-through text-gray-600' : ''}`}>
                            {task.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {task.description}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColors[task.category]} text-white`}>
                            {task.category.replace('_', ' ')}
                          </div>
                          {status === 'overdue' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Overdue
                            </span>
                          )}
                          {status === 'today' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Due Today
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(taskDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-medium ${
                            task.priority === 'high' ? 'text-red-600' :
                            task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {task.priority} priority
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
                        <span>
                          {task.daysFromMove === 0 
                            ? 'Moving Day!' 
                            : task.daysFromMove > 0 
                              ? `${task.daysFromMove} days after move`
                              : `${Math.abs(task.daysFromMove)} days before move`
                          }
                        </span>
                      </div>
                      
                      {!task.completed && (
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => toggleTask(task.id)}
                            className="flex-1"
                            variant={status === 'today' ? 'default' : 'outline'}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Moving Day Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold mb-2">Moving Day Celebration!</h3>
                <p className="text-emerald-100 text-lg mb-6">
                  {formatDate(moveDate)} - The big day is here!
                </p>
                <div className="flex items-center justify-center space-x-8 text-emerald-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{daysUntilMove}</div>
                    <div className="text-sm">days to go</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">🏠</div>
                    <div className="text-sm">new home</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">✨</div>
                    <div className="text-sm">new chapter</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
