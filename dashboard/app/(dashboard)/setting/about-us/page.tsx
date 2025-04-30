"use client"

import type React from "react"

import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"
import Image from "next/image"

export default function AboutUsPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [aboutData, setAboutData] = useState({
    products: "30555",
    customers: "12259",
    vendors: "2037",
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "About Us updated",
      description: "The about us information has been updated successfully.",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAboutData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">About Us</h1>
          <Breadcrumb />
        </div>
        <Button onClick={isEditing ? handleSave : handleEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          {isEditing ? "Save" : "Edit About"}
        </Button>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>About Drip Swag</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi condimentum
          porttitor turpis sed ultrices. Suspendisse auctor faucibus magna, imperdiet maximus orci ultrices a. Cras
          placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisi in pellentesque. Sed ante orci, egestas id
          quam nec, eleifend varius magna. Fusce massa nisi, aliquam at cursus eu.
        </p>

        <h3>Our Mission</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi condimentum
          porttitor turpis sed ultrices. Suspendisse auctor faucibus magna, imperdiet maximus orci ultrices a. Cras
          placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisi in pellentesque. Sed ante orci, egestas id
          quam nec, eleifend varius magna. Fusce massa nisi, aliquam at cursus eu.Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
        </p>

        <h3>What We Offer</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper.
        </p>
        <ul>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est
            urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
          </li>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est
            urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
          </li>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est
            urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
          </li>
        </ul>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
        </p>

        <h3>Empowering Local Businesses</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper.
        </p>
        <ul>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est
            urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
          </li>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est
            urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
          </li>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est
            urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
          </li>
        </ul>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
        </p>

        <h3>Our Commitment</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi condimentum
          porttitor turpis sed ultrices. Suspendisse auctor faucibus magna, imperdiet maximus orci ultrices a. Cras
          placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisi in pellentesque. Sed ante orci, egestas id
          quam nec, eleifend varius magna. Fusce massa nisi, aliquam at cursus eu.
        </p>

        <h3>Join Us</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna.
          Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi condimentum
          porttitor turpis sed ultrices.
        </p>
        <p>
          Suspendisse auctor faucibus magna, imperdiet maximus orci ultrices a. Cras placerat elit a sagittis tristique.
          Etiam imperdiet pulvinar nisi in pellentesque. Sed ante orci, egestas id quam nec, eleifend varius magna.
          Fusce massa nisi, aliquam at cursus eu.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
          <div>
            <h4>Our Products:</h4>
            {isEditing ? (
              <Input name="products" value={aboutData.products} onChange={handleChange} />
            ) : (
              <div className="border p-3 rounded-md">{aboutData.products}</div>
            )}

            <h4 className="mt-4">Satisfied Customers:</h4>
            {isEditing ? (
              <Input name="customers" value={aboutData.customers} onChange={handleChange} />
            ) : (
              <div className="border p-3 rounded-md">{aboutData.customers}</div>
            )}

            <h4 className="mt-4">Our Vendor:</h4>
            {isEditing ? (
              <Input name="vendors" value={aboutData.vendors} onChange={handleChange} />
            ) : (
              <div className="border p-3 rounded-md">{aboutData.vendors}</div>
            )}
          </div>

          <div className="border border-dashed p-4 rounded-md flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/About%20Us-F0jMlviTO2G4ZM7B0wZqMx8iSajeZI.png"
              alt="Team"
              width={400}
              height={300}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

