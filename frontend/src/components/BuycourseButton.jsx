import React from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useCreateCheckoutSessionMutation, useUpdateEnrollmentMutation } from '@/features/api/Purchaseapi';
import { toast } from 'sonner';

const BuycourseButton = ({ courseId, isPurchased, setIsPurchased }) => {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();
  const [updateEnrollment] = useUpdateEnrollmentMutation();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const purchaseCourseHandler = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    try {
      const response = await createCheckoutSession({ courseId }).unwrap();
      const {
        orderId,
        amount,
        currency,
        key,
        courseTitle,
        courseThumbnail
      } = response;

      const options = {
        key,
        amount,
        currency: currency || "INR",
        name: "My LMS Platform",
        description: courseTitle || "Course purchase",
        image: courseThumbnail || "https://via.placeholder.com/100",
        order_id: orderId,
        handler: async function (razorResponse) {
          console.log("Payment success:", razorResponse);
          toast.success("Payment successful! 🎉");

          try {
            await updateEnrollment({
              courseId,
              razorpay_order_id: razorResponse.razorpay_order_id,
            }).unwrap();
            setIsPurchased(true);
          } catch (err) {
            toast.error("Failed to update enrollment.");
            console.error("Enrollment update error:", err);
          }
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <Button
      disabled={isLoading || isPurchased}
      onClick={purchaseCourseHandler}
      className="w-full"
      variant={isPurchased ? "secondary" : "default"}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Please wait...
        </>
      ) : isPurchased ? "Enrolled" : "Purchase Course"}
    </Button>
  );
};

export default BuycourseButton;
