import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Home, Package, User, Car, Trash2, Recycle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { movingTips } from '../../data/mockData'

const tabIcons = {
  room: Home,
  item: Package,
  personal: User,
  car: Car,
  ewaste: Trash2,
  council: Recycle
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

  const renderTipCard = (tip, index, category) => {
    const IconComponent = tabIcons[category]
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconComponent className="h-5 w-5 text-primary-600" />
                <span className="text-lg">{tip.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(index, category)}
                className={`p-1 ${isFavorite(index, category) ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ⭐
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tip.tip}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold">Moving Tips & Advice</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert tips and advice to make your move smoother and more organized. 
            Star your favorites to save them for quick reference!
          </p>
        </div>

        <Tabs defaultValue="room" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="room" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Room</span>
            </TabsTrigger>
            <TabsTrigger value="item" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Item</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="car" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Car</span>
            </TabsTrigger>
            <TabsTrigger value="ewaste" className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">E-Waste</span>
            </TabsTrigger>
            <TabsTrigger value="council" className="flex items-center space-x-2">
              <Recycle className="h-4 w-4" />
              <span className="hidden sm:inline">Council</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="room">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Room-by-Room Tips</h2>
              <p className="text-muted-foreground">
                Specific advice for packing and moving different rooms in your home
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movingTips.room.map((tip, index) => renderTipCard(tip, index, 'room'))}
            </div>
          </TabsContent>

          <TabsContent value="item">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Item-Specific Tips</h2>
              <p className="text-muted-foreground">
                How to handle different types of items during your move
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movingTips.item.map((tip, index) => renderTipCard(tip, index, 'item'))}
            </div>
          </TabsContent>

          <TabsContent value="personal">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Personal Items & Documents</h2>
              <p className="text-muted-foreground">
                Keep your important personal belongings safe and accessible
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movingTips.personal.map((tip, index) => renderTipCard(tip, index, 'personal'))}
            </div>
          </TabsContent>

          <TabsContent value="car">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Vehicle & Transportation</h2>
              <p className="text-muted-foreground">
                Tips for moving your vehicles and transportation needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movingTips.car.map((tip, index) => renderTipCard(tip, index, 'car'))}
            </div>
          </TabsContent>

          <TabsContent value="ewaste">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Electronic Waste Disposal</h2>
              <p className="text-muted-foreground">
                Responsibly dispose of old electronics and electronic waste
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movingTips.ewaste.map((tip, index) => renderTipCard(tip, index, 'ewaste'))}
            </div>
          </TabsContent>

          <TabsContent value="council">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Council Pickup & Disposal</h2>
              <p className="text-muted-foreground">
                Work with your local council for bulk waste pickup and disposal
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movingTips.council.map((tip, index) => renderTipCard(tip, index, 'council'))}
            </div>
          </TabsContent>
        </Tabs>

        {favoritesTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>Your Favorite Tips ({favoritesTips.length})</span>
                </CardTitle>
                <CardDescription>
                  Quick access to your starred tips for easy reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  View All Favorites
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
