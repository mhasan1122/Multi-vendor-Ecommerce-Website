/* eslint-disable react/no-unescaped-entities */
"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PrivacyPolicyPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Privacy Policy updated",
      description: "The privacy policy has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <Breadcrumb />
        </div>
        <Button onClick={isEditing ? handleSave : handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          {isEditing ? "Save" : "Edit About"}
        </Button>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Privacy Policy</h2>

        <p>
          At Drip Swag, we value and respect your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your personal
          information when you visit our website (yourwebsite.com) or make a
          purchase from us. By using our website, you agree to the practices
          described in this Privacy Policy. Please read it carefully to
          understand our views and practices regarding your personal data.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We may collect the following types of personal information when you
          visit our website or make a purchase:
        </p>
        <ul>
          <li>
            <strong>Personal Identification Information:</strong> Name, email
            address, phone number, shipping and billing address, etc.
          </li>
          <li>
            <strong>Payment Information:</strong> Credit card details, PayPal
            account, or other payment methods (securely processed through
            trusted payment gateways).
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our
            website, such as IP address, browser type, device type, pages
            visited, and other similar information.
          </li>
          <li>
            <strong>Cookies:</strong> We may use cookies to track website
            activity and improve user experience. You can control cookie
            preferences via your browser settings.
          </li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>
            To process and fulfill your orders, including shipping and payment
            processing.
          </li>
          <li>
            To communicate with you regarding your order, product availability,
            or other services.
          </li>
          <li>
            To send promotional offers, newsletters, and other marketing
            communications (with your consent).
          </li>
          <li>
            To improve our website, products, and services based on usage data.
          </li>
          <li>To comply with legal obligations and resolve disputes.</li>
        </ul>

        <h3>3. How We Share Your Information</h3>
        <p>
          We do not sell or rent your personal information to third parties.
          However, we may share your data with trusted third parties under the
          following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We may share your information
            with third-party vendors, payment processors, shipping companies, or
            other service providers that assist us in conducting our business.
          </li>
          <li>
            <strong>Legal Compliance:</strong> We may disclose your information
            when required by law or in response to legal requests, such as a
            subpoena or court order.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or asset sale, your personal data may be transferred as
            part of the transaction.
          </li>
        </ul>

        <h3>4. Data Security</h3>
        <p>
          We use reasonable security measures to protect your personal data from
          unauthorized access, disclosure, alteration, or destruction. However,
          no method of internet transmission is 100% secure, and we cannot
          guarantee absolute security.
        </p>

        <h3>5. Your Rights and Choices</h3>
        <ul>
          <li>
            <strong>Access and Correction:</strong> You may access or update
            your personal information by logging into your account or contacting
            us directly.
          </li>
          <li>
            <strong>Opt-Out of Marketing:</strong> You can opt out of receiving
            marketing emails by following the "unsubscribe" link in any email we
            send.
          </li>
          <li>
            <strong>Data Deletion:</strong> You have the right to request that
            we delete your personal data, subject to certain exceptions (e.g.,
            legal obligations).
          </li>
        </ul>

        <h3>6. Cookies and Tracking Technologies</h3>
        <p>
          We use cookies and similar tracking technologies to enhance user
          experience, analyze website performance, and serve targeted ads. You
          can manage or disable cookies through your browser settings, but
          please note that some features of our website may not function
          properly if cookies are disabled.
        </p>

        <h3>7. International Transfers</h3>
        <p>
          If you are accessing our website from outside the [Country], please
          note that your data may be transferred and processed in [Country]. By
          using our website and providing your information, you consent to such
          transfers.
        </p>

        <h3>8. Children's Privacy</h3>
        <p>
          Our website and services are not directed to individuals under the age
          of 13, and we do not knowingly collect personal information from
          children. If you are a parent or guardian and believe we have
          collected personal information from a child, please contact us
          immediately.
        </p>
      </div>
    </div>
  );
}
