"use client"

import { motion } from "framer-motion"
import ProtectedLayout from "../components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

export default function Rewards() {
  const transactions = [
    {
      id: "TX123456",
      date: "2023-04-15",
      amount: "50 Oanic",
      status: "Completed",
      type: "Reward",
    },
    {
      id: "TX123457",
      date: "2023-04-10",
      amount: "25 Oanic",
      status: "Completed",
      type: "Reward",
    },
    {
      id: "TX123458",
      date: "2023-04-05",
      amount: "10 Oanic",
      status: "Completed",
      type: "Reward",
    },
    {
      id: "TX123459",
      date: "2023-03-28",
      amount: "5 Oanic",
      status: "Completed",
      type: "Reward",
    },
    {
      id: "TX123460",
      date: "2023-03-20",
      amount: "15 Oanic",
      status: "Completed",
      type: "Reward",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            <TextGenerateEffect words="Rewards" />
          </h1>
          <p className="mt-2 text-muted-foreground">Track and manage your OanicAI rewards</p>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Pending Rewards</CardTitle>
                <CardDescription>Rewards waiting to be claimed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">0 Oanic</span>
                  <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    Claim All
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Total Earned</CardTitle>
                <CardDescription>All-time rewards earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">105 Oanic</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your reward transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <motion.div variants={container} initial="hidden" animate="show" className="contents">
                  {transactions.map((tx, index) => (
                    // <motion.tr key={tx.id} variants={item} custom={index} className="contents">
                      <TableRow>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                            {tx.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    // </motion.tr>
                  ))}
                </motion.div>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
