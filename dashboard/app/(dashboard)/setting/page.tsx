"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SettingsAccordion } from "@/components/settings-accordion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import QuillEditor from "@/components/ui/quill-editor";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Import the toast function

const API_BASE_URL = "http://localhost:8001/api/v1/content"; // Define base URL

export default function SettingPage() {
  // const [aboutUs, setAboutUs] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  // const handleAboutUsChange = (value: string) => {
  //   setAboutUs(value);
  // };

  const handleTermsConditionsChange = (value: string) => {
    setTermsConditions(value);
  };

  const handlePrivacyPolicyChange = (value: string) => {
    setPrivacyPolicy(value);
  };

  const fetchInitialContent = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        toast.error(`Failed to fetch content: Status ${response.status}`); // Show error toast
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status && data.data) {
        data.data.forEach((item: { type: string; content: string }) => {
          if (item.type === "about") {
            // setAboutUs(item.content);
          } else if (item.type === "terms") {
            setTermsConditions(item.content);
          } else if (item.type === "privacy") {
            setPrivacyPolicy(item.content);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching initial content:", error);
      // Error toast is already shown above
    }
  };

  useEffect(() => {
    fetchInitialContent();
  }, []);

  const handleSaveContent = async (type: string, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content, type: type }),
      });

      if (!response.ok) {
        toast.error(`Failed to update ${type}: Status ${response.status}`); // Show error toast
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully:`,
        data,
      );
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`,
      ); // Show success toast
      fetchInitialContent(); // Refetch after saving
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      // Error toast is already shown above
    }
  };

  // const handleSavePersonalInfo = () => {
  //   console.log("Personal Info:", personalInfo);
  //   toast.success("Personal information saved!"); // Example success toast for personal info
  //   // In a real application, you would likely have an API endpoint to save personal info.
  //   // For this example, we'll just log it and show a toast.
  // };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Setting</h1>
        <Breadcrumb />
      </div>

      <div className="space-y-2">
        {/* <SettingsAccordion title="About Us">
          <div className="space-y-4">
            <Label htmlFor="about-us">About Us</Label>
            <QuillEditor
              id="about-us"
              value={aboutUs}
              onChange={handleAboutUsChange}
            />
            <Button onClick={() => handleSaveContent("about", aboutUs)}>
              Save Changes
            </Button>
          </div>
        </SettingsAccordion> */}

        <SettingsAccordion title="Terms & conditions">
          <div className="space-y-4">
            <Label htmlFor="terms-conditions">Terms & Conditions</Label>
            <QuillEditor
              id="terms-conditions"
              value={termsConditions}
              onChange={handleTermsConditionsChange}
            />
            <Button onClick={() => handleSaveContent("terms", termsConditions)}>
              Save Changes
            </Button>
          </div>
        </SettingsAccordion>

        <SettingsAccordion title="Privacy Policy">
          <div className="space-y-4">
            <Label htmlFor="privacy-policy">Privacy Policy</Label>
            <QuillEditor
              id="privacy-policy"
              value={privacyPolicy}
              onChange={handlePrivacyPolicyChange}
            />
            <Button onClick={() => handleSaveContent("privacy", privacyPolicy)}>
              Save Changes
            </Button>
          </div>
        </SettingsAccordion>
      </div>
    </div>
  );
}
