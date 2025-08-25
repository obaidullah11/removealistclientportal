import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Plus, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { mockTimelineTasks } from '../../data/mockData'

const weeklyTasks = {
  'Week 8': [
    { id: 'w8-1', title: 'Research moving companies', completed: true, priority: 'high' },
    { id: 'w8-2', title: 'Get moving quotes', completed: true, priority: 'high' },
    { id: 'w8-3', title: 'Create moving budget', completed: false, priority: 'medium' },
    { id: 'w8-4', title: 'Start decluttering', completed: true, priority: 'medium' }
  ],
  'Week 7': [
    { id: 'w7-1', title: 'Book moving company', completed: false, priority: 'high' },
    { id: 'w7-2', title: 'Order packing supplies', completed: false, priority: 'high' },
    { id: 'w7-3', title: 'Notify landlord/real estate agent', completed: false, priority: 'medium' },
    { id: 'w7-4', title: 'Research new neighborhood', completed: false, priority: 'low' }
  ],
  'Week 6': [
    { id: 'w6-1', title: 'Start using up frozen/perishable food', completed: false, priority: 'medium' },
    { id: 'w6-2', title: 'Begin packing non-essentials', completed: false, priority: 'medium' },
    { id: 'w6-3', title: 'Arrange time off work for moving day', completed: false, priority: 'high' },
    { id: 'w6-4', title: 'Research schools in new area (if applicable)', completed: false, priority: 'medium' }
  ],
  'Week 5': [
    { id: 'w5-1', title: 'Submit change of address forms', completed: false, priority: 'high' },
    { id: 'w5-2', title: 'Notify utility companies', completed: false, priority: 'high' },
    { id: 'w5-3', title: 'Update address with bank and credit cards', completed: false, priority: 'high' },
    { id: 'w5-4', title: 'Transfer prescriptions to new pharmacy', completed: false, priority: 'medium' }
  ]
}

export default function Checklist() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('all')
  
  const allTasks = Object.values(weeklyTasks).flat()
  const completedTasks = allTasks.filter(task => task.completed).length
  const totalTasks = allTasks.length
  const progress = (completedTasks / totalTasks) * 100

  const filteredTasks = (tasks) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
      return matchesSearch && matchesPriority
    })
  }

  const toggleTask = (taskId) => {
    console.log('Toggle task:', taskId)
    // Mock toggle functionality
  }

  const addCustomTask = () => {
    const title = prompt('Enter task title:')
    if (title) {
      console.log('Add custom task:', title)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moving Checklist</h1>
          <p className="text-muted-foreground">
            Stay organized with your 8-week moving plan
          </p>
        </div>

        {/* Progress Overview */}
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
            <Progress value={progress} className="w-full h-3 mb-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{totalTasks - completedTasks}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedPriority === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedPriority === 'high' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('high')}
                >
                  High
                </Button>
                <Button
                  variant={selectedPriority === 'medium' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('medium')}
                >
                  Medium
                </Button>
                <Button
                  variant={selectedPriority === 'low' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('low')}
                >
                  Low
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Tabs */}
        <Tabs defaultValue="Week 8" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Week 8">Week 8</TabsTrigger>
            <TabsTrigger value="Week 7">Week 7</TabsTrigger>
            <TabsTrigger value="Week 6">Week 6</TabsTrigger>
            <TabsTrigger value="Week 5">Week 5</TabsTrigger>
          </TabsList>

          {Object.entries(weeklyTasks).map(([week, tasks]) => (
            <TabsContent key={week} value={week}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{week} Tasks</span>
                    <Button onClick={addCustomTask} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {filteredTasks(tasks).filter(t => t.completed).length} of {filteredTasks(tasks).length} tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredTasks(tasks).map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                        task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-white border-gray-300 text-gray-400 hover:border-primary-600'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </div>
                      </div>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </motion.div>
                  ))}

                  {filteredTasks(tasks).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No tasks match your current filters
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  )
}
