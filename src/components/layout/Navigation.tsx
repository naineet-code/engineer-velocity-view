import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  User, 
  Ticket, 
  Plus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Team Pulse",
    href: "/",
    icon: BarChart3,
    description: "Real-time team dashboard"
  },
  {
    name: "Sprint Analysis",
    href: "/sprint-analysis",
    icon: TrendingUp,
    description: "Retrospective sprint reviews"
  },
  {
    name: "Developer View",
    href: "/developer-view",
    icon: User,
    description: "Individual developer insights",
    disabled: false
  },
  {
    name: "Ticket View",
    href: "/ticket-view",
    icon: Ticket,
    description: "Detailed ticket analytics",
    disabled: false
  },
  {
    name: "Sprint Planning",
    href: "/sprint-planning",
    icon: Plus,
    description: "Create and plan new sprints",
    disabled: false  // Now fully functional
  }
];

export const Navigation = () => null;
