"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Check, Loader2, User, Code, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { HttpCodeSelect } from "@/components/http-code-select";
import { multiStepFormSchema, type MultiStepFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "HTTP Status", icon: Code },
  { id: 3, title: "Summary", icon: ClipboardCheck },
] as const;

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const form = useForm<MultiStepFormValues>({
    resolver: zodResolver(multiStepFormSchema),
    defaultValues: {
      name: "",
      email: "",
      httpCode: "",
      description: "",
    },
    mode: "onChange",
  });

  const { trigger, getValues, setValue, watch } = form;

  const watchedValues = watch();

  async function goToNext() {
    let fieldsToValidate: (keyof MultiStepFormValues)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["name", "email"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["httpCode", "description"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }

  function goToPrevious() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function onSubmit(data: MultiStepFormValues) {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowDialog(true);
  }

  function handleReset() {
    form.reset();
    setCurrentStep(1);
    setShowDialog(false);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submit HTTP Status Report</CardTitle>
          <CardDescription>
            Complete the form to submit your HTTP status report
          </CardDescription>
          {/* Step indicators */}
          <div className="flex items-center gap-2 pt-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-px w-8 transition-colors",
                        isDone ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive && "bg-primary text-primary-foreground",
                      isDone && "bg-primary/15 text-primary",
                      !isActive && !isDone && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <StepIcon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your full name (2-50 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          We will use this to contact you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: HTTP Status */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <FormField
                    control={form.control}
                    name="httpCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HTTP Status Code</FormLabel>
                        <FormControl>
                          <HttpCodeSelect
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Select the HTTP status code you want to report
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe the issue..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about this HTTP status (3-200 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Summary */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-3 font-medium text-foreground">Review your submission</h4>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-muted-foreground">Name</dt>
                        <dd className="text-sm font-medium text-foreground">
                          {watchedValues.name || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Email</dt>
                        <dd className="text-sm font-medium text-foreground">
                          {watchedValues.email || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          HTTP Code
                        </dt>
                        <dd className="text-sm font-medium font-mono text-foreground">
                          {watchedValues.httpCode || "Not selected"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-muted-foreground">
                          Description
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {watchedValues.description || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>


                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentStep === 1}
                  className="gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={goToNext}
                    className="gap-1.5"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-1.5"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Successful</DialogTitle>
            <DialogDescription>
              Your HTTP status report has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="text-foreground">
              <strong>Name:</strong> {getValues("name")}
            </p>
            <p className="text-foreground">
              <strong>Email:</strong> {getValues("email")}
            </p>
            <p className="text-foreground">
              <strong>HTTP Code:</strong> {getValues("httpCode")}
            </p>
            <p className="text-foreground">
              <strong>Description:</strong> {getValues("description")}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleReset}>Submit Another</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
