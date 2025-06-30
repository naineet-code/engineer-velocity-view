import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { NoDataFallback } from '@/components/shared/NoDataFallback';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Index = () => {
  const { tickets } = useData();

  // If no tickets are loaded, show the fallback
  if (tickets.length === 0) {
    return <NoDataFallback />;
  }

  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(ticket => ticket.status === 'Done').length;
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'In Progress').length;
  const blockedTickets = tickets.filter(ticket => ticket.status === 'Blocked').length;
  const openTickets = tickets.filter(ticket => ticket.status === 'Open').length;

  const statusData = useMemo(() => [
    { name: 'Done', value: completedTickets },
    { name: 'In Progress', value: inProgressTickets },
    { name: 'Blocked', value: blockedTickets },
    { name: 'Open', value: openTickets },
  ], [completedTickets, inProgressTickets, blockedTickets, openTickets]);

  const developerEffort = useMemo(() => {
    const effortMap: { [key: string]: number } = {};
    tickets.forEach(ticket => {
      effortMap[ticket.developer] = (effortMap[ticket.developer] || 0) + ticket.effort_points;
    });
    return Object.entries(effortMap)
      .map(([developer, effort]) => ({ developer, effort }))
      .sort((a, b) => b.effort - a.effort);
  }, [tickets]);

  const priorityCounts = useMemo(() => {
    const priorityMap: { [key: string]: number } = {};
    tickets.forEach(ticket => {
      priorityMap[ticket.priority] = (priorityMap[ticket.priority] || 0) + 1;
    });
    return Object.entries(priorityMap)
      .map(([priority, count]) => ({ priority, count }))
      .sort((a, b) => b.count - a.count);
  }, [tickets]);

  const avgEffortPoints = useMemo(() => {
    const totalEffortPoints = tickets.reduce((sum, ticket) => sum + ticket.effort_points, 0);
    return totalTickets > 0 ? (totalEffortPoints / totalTickets).toFixed(1) : '0';
  }, [tickets, totalTickets]);

  const avgRank = useMemo(() => {
    const totalRank = tickets.reduce((sum, ticket) => sum + ticket.rank, 0);
    return totalTickets > 0 ? (totalRank / totalTickets).toFixed(1) : '0';
  }, [tickets, totalTickets]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
            <CardDescription>All tickets in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Tickets</CardTitle>
            <CardDescription>Tickets with status "Done"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Effort Points</CardTitle>
            <CardDescription>Average effort points across all tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgEffortPoints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rank</CardTitle>
            <CardDescription>Average rank across all tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgRank}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Distribution of tickets by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Effort Distribution</CardTitle>
            <CardDescription>Effort points distribution by developer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={developerEffort} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="developer" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="effort" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Priority Distribution</CardTitle>
          <CardDescription>Distribution of tickets by priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {priorityCounts.map(item => (
              <Badge key={item.priority}>{item.priority}: {item.count}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
