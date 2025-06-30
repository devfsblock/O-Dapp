"use client"
import ProtectedLayout from "../components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"

export default function Help() {
  const faqItems = [
    {
      question: "What is OanicAI?",
      answer:
        "OanicAI is a Web3 platform that provides tools and services for blockchain interaction, data labeling, validation, and marketplace services.",
    },
    {
      question: "How do I connect my wallet?",
      answer:
        "You can connect your wallet by clicking the 'Connect Wallet' button on the login page. We support various wallet providers through the AppKit integration.",
    },
    {
      question: "How do rewards work?",
      answer:
        "Rewards are earned by participating in various activities on the platform, such as completing educational courses, labeling data, or validating content.",
    },
    {
      question: "What is Label Now?",
      answer:
        "Label Now is an upcoming feature that will allow users to participate in data labeling tasks and earn rewards for their contributions.",
    },
    {
      question: "What is Validate Now?",
      answer:
        "Validate Now is an upcoming feature that will enable users to validate and verify data labeled by others, ensuring high-quality datasets.",
    },
    {
      question: "How can I earn more rewards?",
      answer:
        "You can earn more rewards by actively participating in the platform, completing courses in the Academy, and engaging with upcoming features like Label Now and Validate Now.",
    },
    {
      question: "Is my wallet information secure?",
      answer:
        "Yes, we use industry-standard security practices to protect your wallet information. We never store your private keys or seed phrases.",
    },
  ]

  // const supportSections = [
  //   {
  //     title: "Documentation",
  //     content: "Explore our comprehensive documentation to learn about all features and functionalities of OanicAI.",
  //   },
  //   {
  //     title: "Community Support",
  //     content:
  //       "Join our community forums and Discord server to connect with other users and get help from the community.",
  //   },
  //   {
  //     title: "Video Tutorials",
  //     content: "Watch our video tutorials to get step-by-step guidance on using OanicAI features.",
  //   },
  //   {
  //     title: "Contact Support",
  //     content: "Reach out to our support team for personalized assistance with any issues or questions.",
  //   },
  // ]

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            <TextGenerateEffect words="Help & Support" />
          </h1>
          <p className="mt-2 text-muted-foreground">Find answers to your questions and get support</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground">Send us an email at support@oanic.ai</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-medium">Community Forum</h3>
                <p className="text-sm text-muted-foreground">Join our community forum to get help from other users</p>
                <button className="mt-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Visit Forum
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
              <CardDescription>Join our community on social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <a
                  href="#"
                  className="flex flex-col items-center rounded-lg border border-border p-4 transition-colors hover:bg-primary/5 hover:border-primary/50"
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 127.14 96.36"
                      className="h-6 w-6 text-primary"
                      fill="currentColor"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Discord</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center rounded-lg border border-border p-4 transition-colors hover:bg-primary/5 hover:border-primary/50"
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-primary"
                      fill="currentColor"
                    >
                      <path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-1.082.362-1.61.984-.133.155-.267.354-.335.628s-.038.622.095.895c.265.547.714.773 1.244.976 1.76.564 3.58 1.102 5.087 1.608.556 1.96 1.09 3.927 1.618 5.89.174.394.553.54.944.544l.035.001c.32-.001.52-.145.642-.3.03-.04.63-.058.088-.078.06-.05.15-.125.222-.272.13-.26.232-.662.22-.963-.01-.265.012-.57.038-.885.01-.21.022-.425.025-.636.05-.05 1.069-1.078 2.225-2.23 2.393-2.395 5.587-5.587 6.812-6.815 1.054-1.055.54-2.205-.127-2.663-.322-.22-.663-.32-.998-.335h-.002zm-1.574 1.286c.295.3.357.606.173.922-.456.517-3.662 3.724-6.04 6.103-.936.936-1.055 1.056-1.059 1.056l-.001.001c-.236.195-.323.321-.323.321s-.02-.336-.06-.852c-.04-.514-.154-1.78-.154-1.78s-.204-.217-.498-.645c-.295-.428-1.064-1.332-1.842-2.273-.413-.499-.854-1.004-1.208-1.457-.465-.59-.748-.96-.748-.96l.002-.003.01-.01c.006-.006 4.902-1.896 7.575-2.923 1.298-.5 2.356-.908 2.85-1.104.124-.06.219-.094.313-.094.235 0 .405.11.51.214z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Telegram</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center rounded-lg border border-border p-4 transition-colors hover:bg-primary/5 hover:border-primary/50"
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-primary"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">X (Twitter)</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center rounded-lg border border-border p-4 transition-colors hover:bg-primary/5 hover:border-primary/50"
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-primary"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0zm5.92 8.8a.35.35 0 0 1 .35-.35h1.6a.35.35 0 0 1 .35.35v6.9a.35.35 0 0 1-.35.35h-1.6a.35.35 0 0 1-.35-.35V8.8zm-3.07 2.55a.35.35 0 0 1 .35-.35h1.6a.35.35 0 0 1 .35.35v4.35a.35.35 0 0 1-.35.35h-1.6a.35.35 0 0 1-.35-.35v-4.35zm-9.1-1.35a.35.35 0 0 1 .35-.35h1.6a.35.35 0 0 1 .35.35v5.7a.35.35 0 0 1-.35.35h-1.6a.35.35 0 0 1-.35-.35V10zm6.04 1.35a.35.35 0 0 1 .35-.35h1.6a.35.35 0 0 1 .35.35v4.35a.35.35 0 0 1-.35.35h-1.6a.35.35 0 0 1-.35-.35v-4.35z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Dextools</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center rounded-lg border border-border p-4 transition-colors hover:bg-primary/5 hover:border-primary/50"
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-primary"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center rounded-lg border border-border p-4 transition-colors hover:bg-primary/5 hover:border-primary/50"
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-primary"
                      fill="currentColor"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
