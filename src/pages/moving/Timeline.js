import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { mockTimelineTasks } from '../../data/mockData'
import { formatDate } from '../../lib/utils'

const categoryColors = {
  logistics: 'bg-blue-100 text-blue-800',
  preparation: 'bg-green-100 text-green-800',
  supplies: 'bg-yellow-100 text-yellow-800',
  utilities: 'bg-purple-100 text-purple-800',
  address_change: 'bg-orange-100 text-orange-800',
  packing: 'bg-red-100 text-red-800',
  moving_day: 'bg-primary-100 text-primary-800'
}

export default function Timeline() {
  const moveDate = new Date('2024-03-15')
  const today = new Date()
  const completedTasks = mockTimelineTasks.filter(task => task.completed).length
  const totalTasks = mockTimelineTasks.length
  const progress = (completedTasks / totalTasks) * 100

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

  const toggleTask = (taskId) => {
    // Mock toggle functionality
    console.log('Toggle task:', taskId)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moving Timeline</h1>
          <p className="text-muted-foreground">
            Your personalized moving plan counting down to {formatDate(moveDate)}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="text-2xl font-bold text-primary-600">
                {Math.round(progress)}%
              </span>
            </CardTitle>
            <CardDescription>
              {completedTasks} of {totalTasks} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Started</span>
              <span>Moving Day</span>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>

          <div className="space-y-6">
            {mockTimelineTasks.map((task, index) => {
              const status = getTaskStatus(task)
              const taskDate = getTaskDate(task.daysFromMove)
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start space-x-4"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : status === 'overdue'
                          ? 'bg-red-100 border-red-300 text-red-600'
                          : status === 'today'
                          ? 'bg-yellow-100 border-yellow-300 text-yellow-600'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : status === 'overdue' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : status === 'today' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Task card */}
                  <Card className={`flex-1 ${task.completed ? 'opacity-75' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
                            {task.category.replace('_', ' ')}
                          </span>
                          {status === 'overdue' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Overdue
                            </span>
                          )}
                          {status === 'today' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(taskDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>
                            {task.daysFromMove === 0 
                              ? 'Moving Day!' 
                              : task.daysFromMove > 0 
                                ? `${task.daysFromMove} days after move`
                                : `${Math.abs(task.daysFromMove)} days before move`
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!task.completed && (
                        <div className="mt-3 flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => toggleTask(task.id)}
                          >
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
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

        {/* Moving Day Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">🎉 Moving Day!</h3>
                  <p className="opacity-90">{formatDate(moveDate)}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {Math.ceil((moveDate - today) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm opacity-90">days to go</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
