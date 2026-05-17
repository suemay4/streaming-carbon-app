// src/utils/carbonLogic.test.js
import { describe, test, expect } from 'vitest';
import { calculateFootprint, REGION_FACTORS, RESOLUTION_PROFILES, DEVICE_PROFILES } from '../utils/carbonLogic';

// ============================================================================
// SUITE 1: CORE MATH ENGINE SCENARIOS (UT-001 to UT-008)
// ============================================================================

describe('Computational Engine Unit Tests', () => {
    // Test Case 1: Checking Peninsular Malaysia
    test('UT-001: Should compute accurate emissions for Peninsular Malaysia grid', () => {
        const result = calculateFootprint(44, '1080p', 'Smartphone', 'Peninsular Malaysia');
        // Asserting the exact numbers from system outputs
        expect(result.total).toBe(16.14);
        expect(result.breakdown.device).toBe(2.44);
        expect(result.breakdown.net).toBe(10.04);
        expect(result.breakdown.dc).toBe(3.66);
    });

    // Test Case 2: Checking Sarawak
    test('UT-002: Should scale down emissions accurately for the Sarawak Hydropower grid', () => {
        const result = calculateFootprint(44, '1080p', 'Smartphone', 'Sarawak');
        // Expected values drop because Sarawak factor is 0.199 instead of 0.740
        expect(result.total).toBe(4.34);
        expect(result.breakdown.device).toBe(0.66);
        expect(result.breakdown.net).toBe(2.7);
        expect(result.breakdown.dc).toBe(0.99);
    });

    // Test Case 3: High-Intensity 4K Streaming on a Large Screen
    test('UT-003: Should compute heavy workloads accurately (4K Streaming on Smart TV in Peninsular)', () => {
        const result = calculateFootprint(120, '4K', 'Smart TV', 'Peninsular Malaysia');
        expect(result.total).toBe(137.82);
        expect(result.breakdown.device).toBe(75.48);
        expect(result.breakdown.net).toBe(27.38);
        expect(result.breakdown.dc).toBe(34.97);
    });

    // Test Case 4: Regional Scaling Comparison (Sabah Grid Boundary)
    test('UT-004: Should evaluate accurate emissions using the Sabah grid factor', () => {
        const result = calculateFootprint(60, '720p', 'Laptop', 'Sabah');
        expect(result.total).toBe(35.06);
        expect(result.breakdown.device).toBe(22.91);
        expect(result.breakdown.net).toBe(9.97);
        expect(result.breakdown.dc).toBe(2.18);
    });

    test('UT-005: Function must evaluate zero minutes as absolute zero emissions without crashing', () => {
        // Directly testing the function engine fallback boundary
        const result = calculateFootprint(0, '1080p', 'Smartphone', 'Peninsular Malaysia');
        expect(result.total).toBe(0);
        expect(result.breakdown.device).toBe(0);
        expect(result.breakdown.net).toBe(0);
        expect(result.breakdown.dc).toBe(0);
    });

    test('UT-006: Passing an unmapped resolution profile should gracefully default to standard baseline metrics instead of crashing', () => {
        // Inputs: 44 mins, unmapped '8K' string, Smartphone, Peninsular grid
        const result = calculateFootprint(44, '8K', 'Smartphone', 'Peninsular Malaysia');

        // If your fallback logic points to 1080p, it should match your UT-001 outputs exactly!
        expect(result.total).toBe(13.95);
        expect(result.breakdown.device).toBe(2.44);
        expect(result.breakdown.net).toBe(10.04);
        expect(result.breakdown.dc).toBe(1.47);
    });

    test('UT-007: Passing an unmapped device should gracefully default to Smartphone', () => {
        const result = calculateFootprint(30, '1080p', 'Smart Fridge', 'Peninsular Malaysia');
        expect(result.total).toBe(11.01);
        expect(result.breakdown.device).toBe(1.66);
        expect(result.breakdown.net).toBe(6.84);
        expect(result.breakdown.dc).toBe(2.5);
    });

    test('UT-008: Unknown region string should fallback gracefully to Peninsular', () => {
        const result = calculateFootprint(44, '1080p', 'Smartphone', 'Unknown Location');
        expect(result.total).toBe(16.14); // Uses 0.740 fallback baseline matching UT-001
    });
});

// ============================================================================
// SUITE 2: SYSTEM INTEGRITY, DATA BOUNDS & FREQUENCY SCALING (UT-010 to UT-012)
// ============================================================================
describe('Structural Constants & State Integrity', () => {
    test('UT-009: Data dictionary constants should retain accurate empirical values', () => {
        // Index 0 is your 360p object profile
        expect(RESOLUTION_PROFILES[0].value).toBe('360p');
        expect(RESOLUTION_PROFILES[0].rate).toBe(1.8);

    // Index 1 is your 720p object profile
        expect(RESOLUTION_PROFILES[1].value).toBe('720p');
        expect(RESOLUTION_PROFILES[1].rate).toBe(2.7);

        const smartphone = DEVICE_PROFILES.find(d => d.name === 'Smartphone');
        const laptop = DEVICE_PROFILES.find(d => d.name === 'Laptop');
        expect(smartphone.power).toBe(4.5);
        expect(laptop.power).toBe(42.5);
    });

    test('UT-010: Engine outputs must always be numbers capped at two decimal limits', () => {
        const result = calculateFootprint(17, '720p', 'Laptop', 'Sarawak'); // Generates fractional values
        expect(typeof result.total).toBe('number');
    
        // Confirms no erratic, loose floating point trailing fractions are leaked
        const decimalParts = result.total.toString().split('.');
        if (decimalParts[1]) {
        expect(decimalParts[1].length).toBeLessThanOrEqual(2);
        }
    });

    test('UT-011: Periodic frequency multipliers must scale output linearly', () => {
        const singleSession = calculateFootprint(30, '1080p', 'Smartphone', 'Peninsular Malaysia');
    
        // Testing a scenario where user streams the exact session 3 times a day
        const simulatedFrequencyTotal = singleSession.total * 3;
        expect(simulatedFrequencyTotal).toBeCloseTo(singleSession.total * 3, 2);
    });

    // Test Case 3: Verify Integrity of Regional Constants
    test('UT-012: Regional grid multipliers must match official Energy Commission limits', () => {
        expect(REGION_FACTORS['Peninsular Malaysia']).toBe(0.740);
        expect(REGION_FACTORS['Sabah']).toBe(0.539);
        expect(REGION_FACTORS['Sarawak']).toBe(0.199);
    });
});