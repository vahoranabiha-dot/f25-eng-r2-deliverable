/* eslint-disable */
"use client";
import { axisBottom, axisLeft } from "d3-axis";
import { csv } from "d3-fetch";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";

interface AnimalDatum {
  name: string;
  speed: number;
  diet: "herbivore" | "carnivore" | "omnivore";
}

export default function AnimalSpeedGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  useEffect(() => {
    csv("/sample_animals.csv").then((data) => {
      const cleanedData = data
        .map((row) => ({
          name: row.name || "",
          speed: Number(row.speed) || 0,
          diet: row.diet as "herbivore" | "carnivore" | "omnivore",
        }))
        .filter((item) => item.name && item.speed > 0 && ["herbivore", "carnivore", "omnivore"].includes(item.diet))
        .sort((a, b) => b.speed - a.speed)
        .slice(0, 25);

      setAnimalData(cleanedData);
    });
  }, []);

  useEffect(() => {
    if (!graphRef.current || animalData.length === 0) return;

    graphRef.current.innerHTML = "";

    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 150, bottom: 100, left: 80 };

    const svg = select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = scaleBand()
      .domain(animalData.map((d) => d.name))
      .range([0, chartWidth])
      .padding(0.3);

    const maxSpeed = Math.max(...animalData.map((d) => d.speed));
    const yScale = scaleLinear().domain([0, maxSpeed]).range([chartHeight, 0]);

    const colorScale = scaleOrdinal<string>()
      .domain(["herbivore", "carnivore", "omnivore"])
      .range(["#2E7D32", "#C62828", "#EF6C00"]);

    svg
      .selectAll(".bar")
      .data(animalData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name) || 0)
      .attr("y", (d) => yScale(d.speed))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.speed))
      .attr("fill", (d) => colorScale(d.diet))
      .attr("opacity", 0.8);

    svg
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(axisLeft(yScale));

    svg
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 60)
      .style("text-anchor", "middle")
      .text("Animals (Top 25 Fastest)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .text("Speed (km/h)");

    const diets = ["herbivore", "carnivore", "omnivore"];
    const legend = svg.append("g").attr("transform", `translate(${chartWidth + 20}, 0)`);

    diets.forEach((diet, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      g.append("rect").attr("width", 18).attr("height", 18).attr("fill", colorScale(diet));

      g.append("text").attr("x", 24).attr("y", 14).text(diet);
    });

    svg
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", -20)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Animal Speed Comparison");
  }, [animalData]);

  return (
    <div>
      <div
        ref={graphRef}
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          height: "550px",
        }}
      />
      <div
        style={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <p>
          <strong>Chart notes:</strong>
        </p>
        <p>
          • Colors show diet type: <span style={{ color: "#2E7D32" }}>Green=Herbivore</span>,{" "}
          <span style={{ color: "#C62828" }}>Red=Carnivore</span>,{" "}
          <span style={{ color: "#EF6C00" }}>Orange=Omnivore</span>
        </p>
        <p>• Displaying 25 fastest animals</p>
      </div>
    </div>
  );
}
