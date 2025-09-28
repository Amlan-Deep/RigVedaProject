import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { mandalas } from '../data/mandalas';
import { deities } from '../data/deities';
import { chordConnections } from '../data/chordConnections';

const LotusChordDiagram = ({ onChordClick, selectedChord }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 2400, height: 2400 });

  useEffect(() => {

    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const availableWidth = container.clientWidth - 32; // Account for padding
        const availableHeight = container.clientHeight - 32;
        // Increase size by 50%
        const size = Math.min(availableWidth, availableHeight, 3600);
        setDimensions({ width: size, height: size });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2 - 200;
  // Scale radii by 1.5x
  const innerRadius = Math.max(radius * 0.4 * 1.5, 120 * 1.5);
  const outerRadius = innerRadius + 30 * 1.5;


    // Create chord layout
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    // Prepare data for chord diagram
    const matrix = [];
    const mandalaIds = mandalas.map(m => m.id);
    const deityIds = deities.map(d => d.id);

    // Initialize matrix with proper dimensions
    const totalNodes = mandalaIds.length + deityIds.length;
    for (let i = 0; i < totalNodes; i++) {
      matrix[i] = [];
      for (let j = 0; j < totalNodes; j++) {
        matrix[i][j] = 0;
      }
    }

    // Fill matrix with connection data
    chordConnections.forEach(conn => {
      const mandalaIndex = mandalaIds.indexOf(conn.mandala);
      const deityIndex = mandalaIds.length + deityIds.indexOf(conn.deity);
      if (mandalaIndex !== -1 && deityIndex !== -1 && mandalaIndex < totalNodes && deityIndex < totalNodes) {
        matrix[mandalaIndex][deityIndex] = conn.count;
        matrix[deityIndex][mandalaIndex] = conn.count; // Make it symmetric
      }
    });

    // Validate matrix before creating chords
    const isValidMatrix = matrix.every(row => 
      row.every(cell => typeof cell === 'number' && !isNaN(cell))
    );

    if (!isValidMatrix) {
      return;
    }

    const chords = chord(matrix);

    // Debug: Log chord groups to see what we're working with
    console.log('Chord groups:', chords.groups);
    console.log('Number of groups:', chords.groups.length);
    console.log('Expected: 10 mandalas + 8 deities = 18 groups');

    // Create groups
    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);

    // Add gradients
    const defs = svg.append("defs");

    // Mandala gradient
    const mandalaGradient = defs.append("radialGradient")
      .attr("id", "mandalaGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    
    mandalaGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f4c95d");
    mandalaGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e8b42a");

    // Deity gradient
    const deityGradient = defs.append("radialGradient")
      .attr("id", "deityGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    
    deityGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#eeb8c4");
    deityGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#b48dd3");

    // Create arcs for mandalas (inner circle)
    const mandalaArc = d3.arc()
      .innerRadius(innerRadius - 50)
      .outerRadius(innerRadius);

    const mandalaGroup = g.append("g").attr("class", "mandala-group");

    mandalaGroup.selectAll(".mandala-arc")
      .data(chords.groups.slice(0, mandalas.length))
      .enter().append("path")
      .attr("class", "mandala-arc")
      .attr("d", (d, i) => {
        try {
          console.log(`Creating mandala arc ${i}:`, d, mandalas[i]);
          return mandalaArc(d);
        } catch (e) {
          console.error('Error creating mandala arc:', e, d);
          return '';
        }
      })
      .attr("fill", "url(#mandalaGradient)")
      .attr("stroke", "#e8b42a")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).classed("glow-effect", true);
        highlightChords(d.index, 'mandala');
      })
      .on("mouseout", function(event, d) {
        d3.select(this).classed("glow-effect", false);
        clearHighlights();
      })
      .on("click", function(event, d) {
        const mandala = mandalas[d.index];
        onChordClick({ type: 'mandala', data: mandala, chords: chords });
      });

    // Add mandala names inside the arcs - using arc centroid
    mandalaGroup.selectAll(".mandala-text")
      .data(chords.groups.slice(0, mandalas.length))
      .enter().append("text")
      .attr("class", "mandala-text")
      .attr("transform", (d, i) => {
        // Move label further outside the arc for a gap
        const angle = (d.startAngle + d.endAngle) / 2;
        const r = innerRadius + 50; // Increased from 35px to 50px for more gap
        const x = Math.sin(angle) * r;
        const y = -Math.cos(angle) * r;
        return `translate(${x}, ${y}) rotate(${angle * 180 / Math.PI})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "18px")
      .style("fill", "#8b4513")
      .style("font-weight", "bold")
      .style("font-family", "Inter, sans-serif")
      .text((d, i) => mandalas[i].name);

    // Create arcs for deities (outer circle)
    const deityArc = d3.arc()
  .innerRadius(outerRadius)
  .outerRadius(outerRadius + 50);

    const deityGroup = g.append("g").attr("class", "deity-group");

    deityGroup.selectAll(".deity-arc")
      .data(chords.groups.slice(mandalas.length, mandalas.length + deities.length))
      .enter().append("path")
      .attr("class", "deity-arc")
      .attr("d", (d, i) => {
        try {
          return deityArc(d);
        } catch (e) {
          return '';
        }
      })
      .attr("fill", (d, i) => {
        // Bright, distinct colors for deities
        const brightColors = [
          "#FF1744", // Red
          "#FFEA00", // Yellow
          "#00E676", // Green
          "#2979FF", // Blue
          "#F500A3", // Magenta
          "#FF9100", // Orange
          "#00B8D4", // Cyan
          "#C51162"  // Pink
        ];
        return brightColors[i % brightColors.length];
      })
      .attr("stroke", (d, i) => {
        const brightColors = [
          "#FF1744", "#FFEA00", "#00E676", "#2979FF", "#F500A3", "#FF9100", "#00B8D4", "#C51162"
        ];
        return brightColors[i % brightColors.length];
      })
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).classed("glow-effect", true);
        highlightChords(d.index - mandalas.length, 'deity');
      })
      .on("mouseout", function(event, d) {
        d3.select(this).classed("glow-effect", false);
        clearHighlights();
      })
      .on("click", function(event, d) {
        const deity = deities[d.index - mandalas.length];
        onChordClick({ type: 'deity', data: deity, chords: chords });
      });

    // Add deity names inside the arcs - using arc centroid
    deityGroup.selectAll(".deity-text")
      .data(chords.groups.slice(mandalas.length, mandalas.length + deities.length))
      .enter().append("text")
      .attr("class", "deity-text")
      .attr("transform", (d, i) => {
        // Use arc centroid for better positioning
        const centroid = deityArc.centroid(d);
        const angle = (d.startAngle + d.endAngle) / 2;
        return `translate(${centroid[0]}, ${centroid[1]}) rotate(${angle * 180 / Math.PI})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("fill", "#4a5568")
      .style("font-weight", "bold")
      .style("font-family", "Inter, sans-serif")
      .style("cursor", "pointer")
      .on("click", function(event, d) {
        const deity = deities[d.index - mandalas.length];
        onChordClick({ type: 'deity', data: deity, chords: chords });
      })
      .text((d, i) => deities[i].name);

    // Create ribbons (chords)
    const ribbon = d3.ribbon()
      .radius(innerRadius + 30);

    const ribbonGroup = g.append("g").attr("class", "ribbon-group");

    const ribbons = ribbonGroup.selectAll(".chord-ribbon")
      .data(chords)
      .enter().append("path")
      .attr("class", "chord-ribbon")
      .attr("d", d => {
        try {
          return ribbon(d);
        } catch (e) {
          console.error('Error creating ribbon:', e, d);
          return '';
        }
      })
      .attr("fill", d => {
        const mandalaIndex = d.source.index;
        const deityIndex = d.target.index - mandalas.length;
        // Use the same bright color for ribbons as for arcs
        const brightColors = [
          "#FF1744", "#FFEA00", "#00E676", "#2979FF", "#F500A3", "#FF9100", "#00B8D4", "#C51162"
        ];
        return brightColors[deityIndex % brightColors.length];
      })
      .attr("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        showTooltip(event, d);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 0.7);
        hideTooltip();
      })
      .on("click", function(event, d) {
        const mandalaIndex = d.source.index;
        const deityIndex = d.target.index - mandalas.length;
        const mandala = mandalas[mandalaIndex];
        const deity = deities[deityIndex];
        const connection = chordConnections.find(
          c => c.mandala === mandala.id && c.deity === deity.id
        );
        onChordClick({ type: 'chord', mandala, deity, connection });
      });

    // Labels are now added directly inside the arcs above

    // Helper functions
    function highlightChords(index, type) {
      ribbons.style("opacity", d => {
        if (type === 'mandala') {
          return d.source.index === index ? 1 : 0.3;
        } else {
          return d.target.index === index + mandalas.length ? 1 : 0.3;
        }
      });
    }

    function clearHighlights() {
      ribbons.style("opacity", 0.7);
    }

    function showTooltip(event, d) {
      const mandalaIndex = d.source.index;
      const deityIndex = d.target.index - mandalas.length;
      const mandala = mandalas[mandalaIndex];
      const deity = deities[deityIndex];
      const connection = chordConnections.find(
        c => c.mandala === mandala.id && c.deity === deity.id
      );

      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000");

      tooltip.html(`
        <div><strong>${mandala.name}</strong> → <strong>${deity.name}</strong></div>
        <div>${connection?.count || 0} hymns</div>
        <div>Click to explore</div>
      `);

      tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    }

    function hideTooltip() {
      d3.selectAll(".tooltip").remove();
    }


  }, [dimensions, onChordClick, selectedChord]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="flex justify-center items-center w-full h-full"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="lotus-petal"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        <rect
          x="0"
          y="0"
          width={dimensions.width}
          height={dimensions.height}
          fill="#d8a24a" // ochre yellow, rustic
        />
      </svg>
    </motion.div>
  );
};

export default LotusChordDiagram;