"use client"

import type React from "react"

import { useState } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Pencil } from "lucide-react"
import Image from "next/image"

export default function PersonalInformationPage() {
  const { toast } = useToast()
  const [profileImage, setProfileImage] = useState<string | null>("/placeholder-user.jpg")
  const [profileData, setProfileData] = useState({
    fullName: "David Jhon",
    phoneNumber: "+990 3343 7865",
    username: "davidjhon24",
    email: "davidjohn45@gmail.com",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <Breadcrumb />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="fullName" name="fullName" value={profileData.fullName} onChange={handleProfileChange} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input id="username" name="username" value={profileData.username} onChange={handleProfileChange} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                {profileImage ? (
                  <div className="relative">
                    <Image
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full h-24 w-24 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="mt-2 flex space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setProfileImage(null)}>
                    Delete
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("photo-upload")?.click()}
                  >
                    Update
                  </Button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                <p className="text-sm text-center text-gray-500">Drag and drop image here, or click add image</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  Add Image
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="button">Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

