"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RentCalculator() {
  const [income, setIncome] = useState(60000);
  const [percentage, setPercentage] = useState(30);
  const [show, setShow] = useState(false);

  const monthlyIncome = income / 12;
  const rentBudget = (monthlyIncome * percentage) / 100;

  const essential = monthlyIncome * 0.5;
  const nonEssential = monthlyIncome * 0.3;
  const savings = monthlyIncome * 0.2;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">
          Rent Affordability Calculator
        </h1>
        <p className="text-gray-600">
          Find out how much rent you can afford using the 30% rule or the
          50/30/20 budgeting method.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Annual Gross Income ($)
            </label>
            <Input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">
              % of income for rent (recommended: 30%)
            </label>
            <Input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
            />
          </div>
          <Button onClick={() => setShow(true)} className="w-full">
            Calculate Rent Budget
          </Button>
        </CardContent>
      </Card>

      {show && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>
              <strong>Monthly Income:</strong> ${monthlyIncome.toFixed(2)}
            </p>
            <p>
              <strong>Recommended Rent Budget:</strong> ${rentBudget.toFixed(2)}{" "}
              ({percentage}% of income)
            </p>
            <hr className="my-2" />
            <h4 className="font-semibold">50/30/20 Breakdown</h4>
            <p>
              <strong>Essentials (50%):</strong> ${essential.toFixed(2)}
            </p>
            <p>
              <strong>Non-Essentials (30%):</strong> ${nonEssential.toFixed(2)}
            </p>
            <p>
              <strong>Savings (20%):</strong> ${savings.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
