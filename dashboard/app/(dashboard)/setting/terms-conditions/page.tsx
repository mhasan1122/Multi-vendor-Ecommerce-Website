"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function TermsConditionsPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Terms & Conditions updated",
      description: "The terms and conditions have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>
          <Breadcrumb />
        </div>
        <Button onClick={isEditing ? handleSave : handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          {isEditing ? "Save" : "Edit About"}
        </Button>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Terms & Conditions</h2>

        <p>
          Welcome to Drip Swag. By accessing and using our website dripswag.com
          and purchasing our products, you agree to comply with and be bound by
          the following terms and conditions. Please read these Terms carefully.
          If you do not agree to these Terms, please do not use the Site or make
          a purchase.
        </p>

        <h3>Use of the Site</h3>
        <p>
          By using this Site, you agree to use it in accordance with these Terms
          and for lawful purposes only. You agree that you will not:
        </p>
        <ul>
          <li>Violate any applicable laws or regulations.</li>
          <li>
            Upload or transmit any harmful or illegal content, including viruses
            or malware.
          </li>
          <li>
            Attempt to access data or systems that you are not authorized to
            access.
          </li>
          <li>
            Engage in any activity that disrupts the functionality of the Site.
          </li>
        </ul>

        <h3>Account Registration</h3>
        <p>
          To place an order or access certain services, you may need to create
          an account. You agree to provide accurate, current, and complete
          information during the registration process and to update your
          information as necessary. You are responsible for maintaining the
          confidentiality of your account information, including your password,
          and for all activities that occur under your account.
        </p>

        <h3>Orders and Payment</h3>
        <p>
          By placing an order, you make an offer to purchase the items in your
          cart at the prices listed, subject to these Terms. We reserve the
          right to accept or decline your order at our sole discretion. Once
          your order is accepted, you will receive an order confirmation.
          Payment is due at the time of purchase. We accept various payment
          methods, including credit/debit cards, PayPal, and other secure
          payment options. By submitting payment information, you represent that
          you are authorized to use the payment method and that the information
          is accurate.
        </p>

        <h3>Shipping and Delivery</h3>
        <p>
          We aim to process and ship orders promptly. Shipping costs and
          delivery times vary depending on the shipping method chosen and your
          location. Delivery dates are estimates and are not guaranteed. We are
          not responsible for any delays caused by shipping carriers.
        </p>

        <h3>Returns and Refunds</h3>
        <p>
          We want you to be satisfied with your purchase. If you are not happy
          with an item, please refer to our Return Policy for instructions on
          how to return or exchange products. Generally, returns must be made
          within [X] days of receiving your order, and items must be in new,
          unused condition with original packaging.
        </p>

        <h3>Intellectual Property</h3>
        <p>
          All content on the Site, including text, graphics, logos, images, and
          software, is the property of [Your Company Name] or its licensors and
          is protected by copyright, trademark, and other intellectual property
          laws. You may not use, copy, modify, or distribute any content without
          our express written consent.
        </p>

        <h3>User-Generated Content</h3>
        <p>
          If you submit any content, including reviews, feedback, or
          suggestions, to our Site, you grant [Your Company Name] a
          non-exclusive, royalty-free, worldwide license to use, display, and
          distribute such content in connection with our business.
        </p>

        <h3>Privacy</h3>
        <p>
          Your use of the Site is also governed by our Privacy Policy, which can
          be found [here]. By using our Site, you consent to the collection and
          use of your information as outlined in our Privacy Policy.
        </p>

        <h3>Termination</h3>
        <p>
          We reserve the right to suspend or terminate your access to the Site
          at any time, without notice, for any reason, including violation of
          these Terms. Upon termination, all rights granted to you under these
          Terms will immediately cease, and you must stop using the Site.
        </p>

        <h3>Governing Law</h3>
        <p>
          These Terms and any disputes related to these Terms or the use of the
          Site will be governed by the laws of [Your Country/State], without
          regard to its conflict of law principles.
        </p>

        <h3>Dispute Resolution</h3>
        <p>
          In the event of a dispute, we encourage you to contact us directly to
          attempt to resolve the issue. If a resolution cannot be reached, any
          dispute will be resolved through binding arbitration in [Your
          Country/State], and you agree to waive any rights to a jury trial.
        </p>

        <h3>Changes to These Terms</h3>
        <p>
          We may update these Terms from time to time. Any changes will be
          posted on this page with the updated effective date. We encourage you
          to review these Terms periodically for any changes.
        </p>
      </div>
    </div>
  );
}
