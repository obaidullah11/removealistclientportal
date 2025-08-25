import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Mail, Phone, UserPlus, Crown, User, Settings, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { mockMovingProjects } from '../../data/mockData'

export default function Collaboration() {
  const [collaborators, setCollaborators] = useState(mockMovingProjects[0].collaborators)
  const [inviteMethod, setInviteMethod] = useState('email')
  const [inviteData, setInviteData] = useState({
    email: '',
    phone: '',
    role: 'member'
  })

  const sendInvite = () => {
    if (inviteMethod === 'email' && !inviteData.email) {
      alert('Please enter an email address')
      return
    }
    if (inviteMethod === 'phone' && !inviteData.phone) {
      alert('Please enter a phone number')
      return
    }

    const newCollaborator = {
      id: `collab-${Date.now()}`,
      name: inviteMethod === 'email' ? inviteData.email.split('@')[0] : 'Phone User',
      email: inviteData.email || '',
      phone: inviteData.phone || '',
      role: inviteData.role,
      status: 'pending',
      invitedDate: new Date().toISOString().split('T')[0]
    }

    setCollaborators([...collaborators, newCollaborator])
    setInviteData({ email: '', phone: '', role: 'member' })
    alert(`Invitation sent via ${inviteMethod}!`)
  }

  const updateCollaboratorRole = (collaboratorId, newRole) => {
    setCollaborators(collaborators.map(collab =>
      collab.id === collaboratorId ? { ...collab, role: newRole } : collab
    ))
  }

  const removeCollaborator = (collaboratorId) => {
    if (confirm('Are you sure you want to remove this collaborator?')) {
      setCollaborators(collaborators.filter(collab => collab.id !== collaboratorId))
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />
      case 'admin': return <Settings className="h-4 w-4 text-blue-600" />
      default: return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Collaboration</h1>
          <p className="text-muted-foreground">
            Invite family members and friends to help with your move
          </p>
        </div>

        <Tabs defaultValue="collaborators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="invite">Invite People</TabsTrigger>
          </TabsList>

          <TabsContent value="collaborators">
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Collaborators</p>
                        <p className="text-2xl font-bold">{collaborators.length}</p>
                      </div>
                      <UserPlus className="h-8 w-8 text-primary-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">{collaborators.filter(c => c.status === 'active').length}</p>
                      </div>
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold">{collaborators.filter(c => c.status === 'pending').length}</p>
                      </div>
                      <Mail className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Collaborators List */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your moving team and their permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaborators.map((collaborator, index) => (
                      <motion.div
                        key={collaborator.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary-600">
                              {collaborator.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{collaborator.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              {collaborator.email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{collaborator.email}</span>
                                </div>
                              )}
                              {collaborator.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{collaborator.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(collaborator.role)}`}>
                            {getRoleIcon(collaborator.role)}
                            <span>{collaborator.role}</span>
                          </span>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collaborator.status)}`}>
                            {collaborator.status}
                          </span>

                          <div className="flex space-x-1">
                            <select
                              value={collaborator.role}
                              onChange={(e) => updateCollaboratorRole(collaborator.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1"
                              disabled={collaborator.role === 'owner'}
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                              {collaborator.role === 'owner' && <option value="owner">Owner</option>}
                            </select>
                            
                            {collaborator.role !== 'owner' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCollaborator(collaborator.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Permissions Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Role Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-1">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <span>Owner</span>
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Full access to all features</li>
                        <li>• Can invite/remove members</li>
                        <li>• Can change project settings</li>
                        <li>• Can delete the project</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-1">
                        <Settings className="h-4 w-4 text-blue-600" />
                        <span>Admin</span>
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Can edit project details</li>
                        <li>• Can manage inventory</li>
                        <li>• Can assign tasks</li>
                        <li>• Can view all data</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-600" />
                        <span>Member</span>
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Can view project details</li>
                        <li>• Can add/edit own tasks</li>
                        <li>• Can comment and collaborate</li>
                        <li>• Limited editing permissions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invite">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Invite New Collaborators</CardTitle>
                  <CardDescription>
                    Add family members and friends to help with your move
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">How would you like to invite them?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          inviteMethod === 'email'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setInviteMethod('email')}
                      >
                        <Mail className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">Send via email</div>
                      </button>
                      <button
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          inviteMethod === 'phone'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setInviteMethod('phone')}
                      >
                        <Phone className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">Send via SMS</div>
                      </button>
                    </div>
                  </div>

                  {inviteMethod === 'email' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                      />
                    </div>
                  )}

                  {inviteMethod === 'phone' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={inviteData.phone}
                        onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      value={inviteData.role}
                      onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {inviteData.role === 'admin' 
                        ? 'Can edit project details and manage tasks'
                        : 'Can view project and manage own tasks'
                      }
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Invitation Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      "You've been invited to collaborate on the moving project: Downtown Apartment to Suburban House. 
                      Join the team to help plan and organize this move!"
                    </p>
                  </div>

                  <Button onClick={sendInvite} className="w-full" variant="primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
