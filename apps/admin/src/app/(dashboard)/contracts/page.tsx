'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@admissions-compass/ui';
import { ContractGenerator } from '@/components/contracts/contract-generator';
import { ContractTracker } from '@/components/contracts/contract-tracker';

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState('tracker');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">
          Generate, send, and track enrollment contracts and agreements for
          accepted students.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tracker">Contract Tracker</TabsTrigger>
          <TabsTrigger value="generate">Generate Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="mt-4">
          <ContractTracker />
        </TabsContent>

        <TabsContent value="generate" className="mt-4">
          <ContractGenerator onGenerated={() => setActiveTab('tracker')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
