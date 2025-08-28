import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Heart, Star, BookOpen, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
// Static moving tips data
const mockMovingTips = {
  room: [
    { 
      icon: "🛋️",
      title: "Living Room", 
      tip: "Wrap electronics in bubble wrap and keep original boxes when possible. Take photos of cable connections before disconnecting.",
      difficulty: "Easy"
    },
    { 
      icon: "🍳",
      title: "Kitchen", 
      tip: "Pack dishes vertically like records to prevent breaking. Use towels and linens as padding to save space.",
      difficulty: "Medium"
    },
    { 
      icon: "🛏️",
      title: "Bedroom", 
      tip: "Use vacuum bags for clothing to save 75% space. Keep one outfit accessible for moving day.",
      difficulty: "Easy"
    }
  ],
  item: [
    { 
      icon: "📦",
      title: "Fragile Items", 
      tip: "Use plenty of padding and mark boxes clearly as 'FRAGILE' on all sides. Pack heavier items on bottom.",
      difficulty: "Medium"
    },
    { 
      icon: "⚖️",
      title: "Heavy Items", 
      tip: "Use smaller boxes for heavy items to make them easier to carry. Limit weight to 50lbs per box.",
      difficulty: "Hard"
    },
    { 
      icon: "💎",
      title: "Valuables", 
      tip: "Keep important documents and valuables with you during the move. Consider a safety deposit box.",
      difficulty: "Easy"
    }
  ],
  personal: [
    { 
      icon: "📋",
      title: "Important Documents", 
      tip: "Keep birth certificates, passports, and insurance papers in a waterproof folder that travels with you.",
      difficulty: "Easy"
    },
    { 
      icon: "💊",
      title: "Medications", 
      tip: "Pack a separate bag with all necessary medications and keep it temperature controlled.",
      difficulty: "Easy"
    },
    { 
      icon: "🚨",
      title: "Emergency Kit", 
      tip: "Prepare a first-aid kit and emergency supplies for moving day including snacks and water.",
      difficulty: "Easy"
    }
  ]
}

export default function Tips() {
  const [favoritesTips, setFavoritesTips] = useState([])

  const toggleFavorite = (tipIndex, category) => {
    const tipId = `${category}-${tipIndex}`
    setFavoritesTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    )
  }

  const isFavorite = (tipIndex, category) => {
    return favoritesTips.includes(`${category}-${tipIndex}`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-green-600'
      case 'Medium': return 'from-yellow-500 to-yellow-600'
      case 'Hard': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const renderTipCard = (tip, index, category) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="h-full"
      >
        <Card className="h-full border-2 hover:border-primary-300 transition-all hover:shadow-xl group cursor-pointer">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{tip.icon}</div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                    {tip.title}
                  </CardTitle>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(tip.difficulty)} text-white mt-2`}>
                    {tip.difficulty}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(index, category)}
                className={`p-2 hover:scale-110 transition-transform ${
                  isFavorite(index, category) 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Star className={`h-5 w-5 ${isFavorite(index, category) ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{tip.tip}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const tabData = [
    { 
      value: 'room', 
      label: 'Room Tips', 
      icon: '🏠',
      description: 'Room-by-room packing and moving strategies'
    },
    { 
      value: 'item', 
      label: 'Item Tips', 
      icon: '📦',
      description: 'How to handle specific types of items'
    },
    { 
      value: 'personal', 
      label: 'Personal', 
      icon: '👤',
      description: 'Personal belongings and important documents'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-4">
                <Lightbulb className="h-10 w-10 text-yellow-300" />
              </div>
              <h1 className="text-5xl font-bold">Moving Tips & Tricks</h1>
            </div>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Expert advice and insider secrets to make your move smoother, faster, and stress-free. 
              Star your favorites for quick reference!
            </p>
            
            {favoritesTips.length > 0 && (
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Star className="h-5 w-5 text-yellow-300 fill-current" />
                <span className="text-yellow-100 font-medium">
                  {favoritesTips.length} tips saved
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tips Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="room" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-4xl h-auto p-2">
              {tabData.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="flex flex-col items-center space-y-2 p-6 h-auto min-h-[120px] data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <div className="text-2xl">{tab.icon}</div>
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div className="text-xs text-gray-600 text-center leading-tight px-2">
                    {tab.description}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="room" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <span className="text-4xl mr-3">🏠</span>
                Room-by-Room Tips
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Specific strategies for packing and moving different rooms in your home
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMovingTips.room.map((tip, index) => renderTipCard(tip, index, 'room'))}
            </div>
          </TabsContent>

          <TabsContent value="item" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <span className="text-4xl mr-3">📦</span>
                Item-Specific Tips
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                How to handle different types of items safely and efficiently
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMovingTips.item.map((tip, index) => renderTipCard(tip, index, 'item'))}
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <span className="text-4xl mr-3">👤</span>
                Personal Items & Documents
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Keep your important personal belongings safe and accessible
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMovingTips.personal.map((tip, index) => renderTipCard(tip, index, 'personal'))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Favorites Section */}
        {favoritesTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Star className="h-8 w-8 text-yellow-500 fill-current mr-3" />
                  Your Favorite Tips ({favoritesTips.length})
                </CardTitle>
                <CardDescription className="text-base">
                  Quick access to your starred tips for easy reference during your move
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Favorites
                  </Button>
                  <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Share Tips
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pro Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary-200" />
                <h3 className="text-3xl font-bold mb-4">💡 Pro Tip of the Day</h3>
                <p className="text-primary-100 text-lg mb-6 max-w-2xl mx-auto">
                  Start packing non-essential items 6-8 weeks before your move. This reduces last-minute stress 
                  and helps you stay organized throughout the entire process.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-primary-700 hover:text-primary-800"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Save This Tip
                  </Button>
                  <Button 
                    size="lg" 
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    Share with Friends
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
