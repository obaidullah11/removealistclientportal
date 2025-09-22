import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, Shield, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { PageContainer } from '../components/ui/page-container'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../lib/api'

// Default settings - moved outside component to prevent recreation
const defaultSettings = {}

export default function Profile() {
  const { user: authUser, updateUserProfile, updateUserAvatar, changePassword } = useAuth()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const response = await authAPI.getProfile()
        
        if (response.success) {
          const userData = response.data
          
          // Ensure settings object exists
          userData.settings = userData.settings || defaultSettings
          
          setUser(userData)
          setFormData({
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email || '',
            phone: userData.phone_number || ''
          })
        } else {
          console.error('Failed to fetch profile:', response.message)
          setErrors({ profile: response.message || 'Failed to load profile' })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setErrors({ profile: 'Failed to load profile. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [authUser])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setErrors({})
      
      // Map frontend fields to backend fields
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone_number: formData.phone
      }
      
      const response = await updateUserProfile(profileData)
      
      if (response.success) {
        // Update local user state
        setUser({ ...user, ...formData })
        setIsEditing(false)
      } else {
        console.error('Failed to update profile:', response.message)
        setErrors({ profile: response.message || 'Failed to update profile' })
        // Reset form data to current user data
        setFormData({
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email || '',
          phone: user.phone_number || ''
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ profile: 'Profile update failed. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setIsChangingPassword(true)
      setErrors({})
      
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrors({ password: 'New passwords do not match' })
        return
      }
      
      // Validate password length
      if (passwordData.newPassword.length < 8) {
        setErrors({ password: 'New password must be at least 8 characters long' })
        return
      }
      
      const response = await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      })
      
      if (response.success) {
        // Clear password form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // Show success message (you can add a toast notification here)
        alert('Password updated successfully!')
      } else {
        setErrors({ password: response.message || 'Failed to update password' })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setErrors({ password: 'Password change failed. Please try again.' })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <PageContainer 
      loading={isLoading} 
      loadingText="Loading profile..."
      error={!user && !isLoading ? "Failed to load profile. Please try refreshing the page." : null}
    >
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            {errors.profile && (
              <div className="px-6 pb-0">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.profile}</p>
                </div>
              </div>
            )}
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        
                        try {
                          const updatedUser = await updateUserAvatar(file)
                          if (updatedUser) {
                            setUser(updatedUser)
                          }
                        } catch (error) {
                          console.error('Error uploading avatar:', error)
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}</h3>
                  <p className="text-muted-foreground">{user?.email || ''}</p>
                  {user?.phone_number && (
                    <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false)
                        // Reset form data to current user data
                        setFormData({
                          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
                          email: user?.email || '',
                          phone: user?.phone_number || ''
                        })
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      variant="primary"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="primary">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Password Change Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Change Password</h3>
                  {errors.password && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-600 text-sm">{errors.password}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input
                        type="password"
                        placeholder="Enter your current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        error={!!errors.password}
                        helperText={errors.password}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        error={!!errors.password}
                        helperText={errors.password}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        error={!!errors.password}
                        helperText={errors.password}
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
