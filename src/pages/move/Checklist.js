import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Plus, Search, Trophy, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Progress } from '../../components/ui/progress'
// Static checklist data
const weeklyChecklists = [
  {
    week: 8,
    title: "8 Weeks Before",
    subtitle: "Research & Planning",
    progress: 100,
    tasks: [
      { id: "w8-1", title: "Research moving companies", completed: true, priority: "high" },
      { id: "w8-2", title: "Get moving quotes", completed: true, priority: "high" },
      { id: "w8-3", title: "Create moving budget", completed: true, priority: "medium" },
      { id: "w8-4", title: "Start decluttering", completed: true, priority: "medium" }
    ]
  },
  {
    week: 6,
    title: "6 Weeks Before", 
    subtitle: "Book Services",
    progress: 75,
    tasks: [
      { id: "w6-1", title: "Book moving company", completed: true, priority: "high" },
      { id: "w6-2", title: "Order packing supplies", completed: true, priority: "high" },
      { id: "w6-3", title: "Notify landlord/real estate agent", completed: true, priority: "medium" },
      { id: "w6-4", title: "Research new neighborhood", completed: false, priority: "low" }
    ]
  },
  {
    week: 4,
    title: "4 Weeks Before",
    subtitle: "Preparation Phase",
    progress: 50,
    tasks: [
      { id: "w4-1", title: "Start using up frozen/perishable food", completed: true, priority: "medium" },
      { id: "w4-2", title: "Begin packing non-essentials", completed: true, priority: "medium" },
      { id: "w4-3", title: "Arrange time off work for moving day", completed: false, priority: "high" },
      { id: "w4-4", title: "Research schools in new area", completed: false, priority: "medium" }
    ]
  },
  {
    week: 2,
    title: "2 Weeks Before",
    subtitle: "Address Changes",
    progress: 25,
    tasks: [
      { id: "w2-1", title: "Submit change of address forms", completed: false, priority: "high" },
      { id: "w2-2", title: "Notify utility companies", completed: true, priority: "high" },
      { id: "w2-3", title: "Update address with bank and credit cards", completed: false, priority: "high" },
      { id: "w2-4", title: "Transfer prescriptions to new pharmacy", completed: false, priority: "medium" }
    ]
  }
]

export default function Checklist() {
  const [checklists, setChecklists] = useState(weeklyChecklists)
  const [searchTerm, setSearchTerm] = useState('')
  
  const totalTasks = checklists.reduce((acc, week) => acc + week.tasks.length, 0)
  const completedTasks = checklists.reduce((acc, week) => 
    acc + week.tasks.filter(task => task.completed).length, 0
  )
  const overallProgress = (completedTasks / totalTasks) * 100

  const toggleTask = (weekIndex, taskId) => {
    const updatedChecklists = [...checklists]
    const task = updatedChecklists[weekIndex].tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      
      // Recalculate week progress
      const weekTasks = updatedChecklists[weekIndex].tasks
      const weekCompleted = weekTasks.filter(t => t.completed).length
      updatedChecklists[weekIndex].progress = (weekCompleted / weekTasks.length) * 100
      
      setChecklists(updatedChecklists)
    }
  }

  const addCustomTask = (weekIndex) => {
    const title = prompt('Enter task title:')
    if (title) {
      const updatedChecklists = [...checklists]
      const newTask = {
        id: `custom-${Date.now()}`,
        title,
        completed: false,
        priority: 'medium'
      }
      updatedChecklists[weekIndex].tasks.push(newTask)
      setChecklists(updatedChecklists)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600'
      case 'medium': return 'from-yellow-500 to-yellow-600'
      case 'low': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getProgressColor = (progress) => {
    if (progress === 100) return 'from-green-500 to-green-600'
    if (progress >= 75) return 'from-blue-500 to-blue-600'
    if (progress >= 50) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">8-Week Moving Checklist</h1>
            <p className="text-xl text-blue-100 mb-8">
              Stay organized with your personalized weekly action plan
            </p>
            
            {/* Progress Stats */}
            <div className="inline-flex items-center space-x-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-blue-100">complete</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{completedTasks}</div>
                <div className="text-sm text-blue-100">tasks done</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalTasks - completedTasks}</div>
                <div className="text-sm text-blue-100">remaining</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                  Overall Progress
                </CardTitle>
                <CardDescription className="text-base">
                  You're making excellent progress! Keep it up.
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} tasks
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-4" />
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12"
            />
          </div>
        </div>

        {/* Weekly Checklists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {checklists.map((week, weekIndex) => (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: weekIndex * 0.1 }}
            >
              <Card className={`border-2 transition-all hover:shadow-xl ${
                week.progress === 100 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getProgressColor(week.progress)} flex items-center justify-center text-white font-bold text-lg mr-3`}>
                          {week.week}
                        </div>
                        {week.title}
                      </CardTitle>
                      <CardDescription className="text-base ml-15">
                        {week.subtitle}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {Math.round(week.progress)}%
                      </div>
                      {week.progress === 100 && (
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Complete
                        </div>
                      )}
                    </div>
                  </div>
                  <Progress value={week.progress} className="h-2" />
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {week.tasks
                    .filter(task => 
                      searchTerm === '' || 
                      task.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((task, taskIndex) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (weekIndex * 0.1) + (taskIndex * 0.05) }}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all hover:shadow-md ${
                          task.completed 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-white border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(weekIndex, task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                            task.completed
                              ? 'bg-green-500 border-green-400 text-white'
                              : 'border-gray-300 hover:border-primary-500 bg-white'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className={`font-medium ${
                            task.completed ? 'line-through text-gray-600' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                          {task.priority}
                        </div>
                      </motion.div>
                    ))}
                  
                  {/* Add Custom Task */}
                  <Button
                    variant="ghost"
                    onClick={() => addCustomTask(weekIndex)}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-primary-400 h-12 text-gray-600 hover:text-primary-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Task
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Section */}
        {overallProgress >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-100" />
                <h3 className="text-2xl font-bold mb-2">Halfway There! 🎉</h3>
                <p className="text-yellow-100 text-lg">
                  You've completed {Math.round(overallProgress)}% of your moving checklist. 
                  You're doing amazing - keep up the great work!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Completion Celebration */}
        {overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="text-8xl mb-6">🎊</div>
                <h3 className="text-4xl font-bold mb-4">Congratulations!</h3>
                <p className="text-green-100 text-xl mb-8">
                  You've completed your entire moving checklist! You're fully prepared for your move.
                </p>
                <Button size="lg" variant="secondary" className="text-green-700">
                  <Target className="h-5 w-5 mr-2" />
                  View Moving Day Timeline
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
