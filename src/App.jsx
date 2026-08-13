import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorRenderer from './components/CalculatorRenderer';
import HomeInteractive from './components/HomeInteractive';
import CategoryView from './components/CategoryView';
import ErrorBoundary from './components/ErrorBoundary';
import LegalPages from './components/LegalPages';
import LegalView from './components/LegalView';
import { translateSchema } from './engine/translatorEngine';
import { i18n } from './data/i18n';

// Importar esquemas JSON de calculadoras (Finanzas + Salud / Fitness / Nutrición / Médica)
import percentageSchema from './data/calculators/percentage.json';
import bmiSchema from './data/calculators/bmi.json';
import mortgageSchema from './data/calculators/mortgage.json';
import autoLoanSchema from './data/calculators/auto-loan.json';
import compoundInterestSchema from './data/calculators/compound-interest.json';
import retirement401kSchema from './data/calculators/retirement-401k.json';
import salaryTakeHomeSchema from './data/calculators/salary-take-home.json';
import roiCalculatorSchema from './data/calculators/roi-calculator.json';
import budget503020Schema from './data/calculators/budget-50-30-20.json';
import amortizationCalculatorSchema from './data/calculators/amortization-calculator.json';
import mortgagePayoffCalculatorSchema from './data/calculators/mortgage-payoff-calculator.json';
import houseAffordabilityCalculatorSchema from './data/calculators/house-affordability-calculator.json';
import rentCalculatorSchema from './data/calculators/rent-calculator.json';
import dtiRatioCalculatorSchema from './data/calculators/dti-ratio-calculator.json';
import debtSnowballCalculatorSchema from './data/calculators/debt-snowball-calculator.json';
import creditCardPayoffCalculatorSchema from './data/calculators/credit-card-payoff-calculator.json';
import studentLoanPayoffCalculatorSchema from './data/calculators/student-loan-payoff-calculator.json';
import personalLoanCalculatorSchema from './data/calculators/personal-loan-calculator.json';
import inflationCalculatorSchema from './data/calculators/inflation-calculator.json';
import emergencyFundCalculatorSchema from './data/calculators/emergency-fund-calculator.json';
import simpleInterestCalculatorSchema from './data/calculators/simple-interest-calculator.json';
import netWorthCalculatorSchema from './data/calculators/net-worth-calculator.json';
import investmentReturnCalculatorSchema from './data/calculators/investment-return-calculator.json';
import dividendYieldCalculatorSchema from './data/calculators/dividend-yield-calculator.json';
import stockProfitCalculatorSchema from './data/calculators/stock-profit-calculator.json';
import cryptoProfitCalculatorSchema from './data/calculators/crypto-profit-calculator.json';
import cagrCalculatorSchema from './data/calculators/cagr-calculator.json';
import ruleOf72CalculatorSchema from './data/calculators/rule-of-72-calculator.json';
import presentValueCalculatorSchema from './data/calculators/present-value-calculator.json';
import futureValueCalculatorSchema from './data/calculators/future-value-calculator.json';
import npvCalculatorSchema from './data/calculators/npv-calculator.json';
import irrCalculatorSchema from './data/calculators/irr-calculator.json';
import salesTaxCalculatorSchema from './data/calculators/sales-tax-calculator.json';
import vatCalculatorSchema from './data/calculators/vat-calculator.json';
import capitalGainsTaxCalculatorSchema from './data/calculators/capital-gains-tax-calculator.json';
import propertyTaxCalculatorSchema from './data/calculators/property-tax-calculator.json';

// Importaciones de Salud y Nutrición
import calorieNeedsSchema from './data/calculators/calorie-needs.json';
import macroNutrientSchema from './data/calculators/macronutrient-split.json';
import bodyFatSchema from './data/calculators/body-fat-percentage.json';
import bmrCalculatorSchema from './data/calculators/bmr-calculator.json';
import tdeeCalculatorSchema from './data/calculators/tdee-calculator.json';
import idealBodyWeightCalculatorSchema from './data/calculators/ideal-body-weight-calculator.json';
import leanBodyMassCalculatorSchema from './data/calculators/lean-body-mass-calculator.json';
import waistToHipRatioCalculatorSchema from './data/calculators/waist-to-hip-ratio-calculator.json';
import waistToHeightRatioCalculatorSchema from './data/calculators/waist-to-height-ratio-calculator.json';
import bodySurfaceAreaCalculatorSchema from './data/calculators/body-surface-area-calculator.json';

import waterIntakeCalculatorSchema from './data/calculators/water-intake-calculator.json';
import targetHeartRateCalculatorSchema from './data/calculators/target-heart-rate-calculator.json';
import vo2MaxCalculatorSchema from './data/calculators/vo2-max-calculator.json';
import oneRepMaxCalculatorSchema from './data/calculators/one-rep-max-calculator.json';
import paceCalculatorSchema from './data/calculators/pace-calculator.json';
import caloriesBurnedRunningCalculatorSchema from './data/calculators/calories-burned-running-calculator.json';
import caloriesBurnedWalkingCalculatorSchema from './data/calculators/calories-burned-walking-calculator.json';
import caloriesBurnedCyclingCalculatorSchema from './data/calculators/calories-burned-cycling-calculator.json';
import caloriesBurnedSwimmingCalculatorSchema from './data/calories-burned-swimming-calculator.json';
import stepsToMilesKmCalculatorSchema from './data/calculators/steps-to-miles-km-calculator.json';

import pregnancyDueDateCalculatorSchema from './data/calculators/pregnancy-due-date-calculator.json';
import ovulationFertilityCalculatorSchema from './data/calculators/ovulation-fertility-calculator.json';
import periodTrackerCycleCalculatorSchema from './data/calculators/period-tracker-cycle-calculator.json';
import bloodPressureCategoryCalculatorSchema from './data/calculators/blood-pressure-category-calculator.json';
import bloodSugarA1cConverterSchema from './data/calculators/blood-sugar-a1c-converter.json';
import gfrKidneyFunctionCalculatorSchema from './data/calculators/gfr-kidney-function-calculator.json';
import cholesterolRatiosCalculatorSchema from './data/calculators/cholesterol-ratios-calculator.json';
import meanArterialPressureCalculatorSchema from './data/calculators/mean-arterial-pressure-calculator.json';
import ivDripRateCalculatorSchema from './data/calculators/iv-drip-rate-calculator.json';
import pediatricDosageByWeightCalculatorSchema from './data/calculators/pediatric-dosage-by-weight-calculator.json';

// Importaciones de Matemáticas y Geometría
import fractionCalculatorSchema from './data/calculators/fraction-calculator.json';
import scientificNotationCalculatorSchema from './data/calculators/scientific-notation-calculator.json';
import matrixMultiplicationCalculatorSchema from './data/calculators/matrix-multiplication-calculator.json';
import quadraticEquationSolverSchema from './data/calculators/quadratic-equation-solver.json';

import areaCalculatorSchema from './data/calculators/area-calculator.json';
import volumeCalculatorSchema from './data/calculators/volume-calculator.json';

// Importaciones de Ciencia y Física
import speedVelocityCalculatorSchema from './data/calculators/speed-velocity-calculator.json';
import accelerationCalculatorSchema from './data/calculators/acceleration-calculator.json';
import forceMassAccelerationCalculatorSchema from './data/calculators/force-mass-acceleration-calculator.json';
import workEnergyCalculatorSchema from './data/calculators/work-energy-calculator.json';
import kineticEnergyCalculatorSchema from './data/calculators/kinetic-energy-calculator.json';
import potentialEnergyCalculatorSchema from './data/calculators/potential-energy-calculator.json';
import powerWorkTimeCalculatorSchema, { meta } from './data/calculators/power-work-time-calculator.json';
import momentumMassVelocityCalculatorSchema from './data/calculators/momentum-mass-velocity-calculator.json';
import torqueForceDistanceCalculatorSchema from './data/calculators/torque-force-distance-calculator.json';
import pressureForceAreaCalculatorSchema from './data/calculators/pressure-force-area-calculator.json';

import densityMassVolumeCalculatorSchema from './data/calculators/density-mass-volume-calculator.json';
import idealGasLawCalculatorSchema from './data/calculators/ideal-gas-law-calculator.json';
import boylesLawCalculatorSchema from './data/calculators/boyles-law-calculator.json';

import ohmsLawCalculatorSchema from './data/calculators/ohms-law-calculator.json';

// Importaciones de Estadística y Probabilidad
import meanMedianModeSchema from './data/calculators/mean-median-mode.json';
import standardDeviationCalculatorSchema from './data/calculators/standard-deviation-calculator.json';
import zScoreCalculatorSchema from './data/calculators/z-score-calculator.json';
import confidenceIntervalCalculatorSchema from './data/calculators/confidence-interval-calculator.json';
import marginOfErrorCalculatorSchema from './data/calculators/margin-of-error-calculator.json';
import sampleSizeCalculatorSchema from './data/calculators/sample-size-calculator.json';
import pValueCalculatorSchema from './data/calculators/p-value-calculator.json';

import simpleProbabilityCalculatorSchema from './data/calculators/simple-probability-calculator.json';
import combinationsPermutationsCalculatorSchema from './data/calculators/combinations-permutations-calculator.json';
import coinFlipProbabilityCalculatorSchema from './data/calculators/coin-flip-probability-calculator.json';
import diceRollProbabilityCalculatorSchema from './data/calculators/dice-roll-probability-calculator.json';

// Importaciones de Ingeniería y Construcción
import concreteVolumeCalculatorSchema from './data/calculators/concrete-volume-calculator.json';

import beamDeflectionCalculatorSchema from './data/calculators/beam-deflection-calculator.json';

import pipeFlowRateCalculatorSchema from './data/calculators/pipe-flow-rate-calculator.json';

import heatLossCalculatorSchema from './data/calculators/heat-loss-calculator.json';

// Expansión Ciencia y Química
import molesToGramsCalculatorSchema from './data/calculators/moles-to-grams-calculator.json';
import molarityCalculatorSchema from './data/calculators/molarity-calculator.json';
import solutionDilutionCalculatorSchema from './data/calculators/solution-dilution-calculator.json';
import phCalculatorSchema from './data/calculators/ph-calculator.json';
import halfLifeCalculatorSchema from './data/calculators/half-life-calculator.json';
import radioactiveDecayCalculatorSchema from './data/calculators/radioactive-decay-calculator.json';
import stoichiometryCalculatorSchema from './data/calculators/stoichiometry-calculator.json';
import percentYieldCalculatorSchema from './data/calculators/percent-yield-calculator.json';
import empiricalFormulaCalculatorSchema from './data/calculators/empirical-formula-calculator.json';
import gasLawCombinedCalculatorSchema from './data/calculators/gas-law-combined-calculator.json';
// Expansión Física Adicional
import pendulumPeriodCalculatorSchema from './data/calculators/pendulum-period-calculator.json';
import snellsLawRefractionCalculatorSchema from './data/calculators/snells-law-refraction-calculator.json';
import projectileMotionCalculatorSchema from './data/calculators/projectile-motion-calculator.json';
import dopplerEffectCalculatorSchema from './data/calculators/doppler-effect-calculator.json';
import gravitationalForceCalculatorSchema from './data/calculators/gravitational-force-calculator.json';
import coulombLawCalculatorSchema from './data/calculators/coulomb-law-calculator.json';
import waveSpeedCalculatorSchema from './data/calculators/wave-speed-calculator.json';
import bernoulliPressureCalculatorSchema from './data/calculators/bernoulli-pressure-calculator.json';
import CarnotEfficiencyCalculatorSchema from './data/calculators/carnot-efficiency-calculator.json';
import photonEnergyCalculatorSchema from './data/calculators/photon-energy-calculator.json';
// Expansión Estadística Adicional
import varianceCalculatorSchema from './data/calculators/variance-calculator.json';
import interquartileRangeIqrCalculatorSchema from './data/calculators/interquartile-range-iqr-calculator.json';
import percentileRankCalculatorSchema from './data/calculators/percentile-rank-calculator.json';
import linearRegressionCalculatorSchema from './data/calculators/linear-regression-calculator.json';
import chiSquareTestCalculatorSchema from './data/calculators/chi-square-test-calculator.json';
import tTestOneSampleCalculatorSchema from './data/calculators/t-test-one-sample-calculator.json';
import binomialDistributionCalculatorSchema from './data/calculators/binomial-distribution-calculator.json';
import poissonDistributionCalculatorSchema from './data/calculators/poisson-distribution-calculator.json';
import normalDistributionCdfCalculatorSchema from './data/calculators/normal-distribution-cdf-calculator.json';
import bayesTheoremCalculatorSchema from './data/calculators/bayes-theorem-calculator.json';
// Expansión Matemáticas Adicional
import logarithmCalculatorSchema from './data/calculators/logarithm-calculator.json';
import exponentPowerCalculatorSchema from './data/calculators/exponent-power-calculator.json';
import factorCalculatorSchema from './data/calculators/factor-calculator.json';
import gcdLcmCalculatorSchema from './data/calculators/gcd-lcm-calculator.json';
import primeFactorizationCalculatorSchema from './data/calculators/prime-factorization-calculator.json';
import percentageDifferenceCalculatorSchema from './data/calculators/percentage-difference-calculator.json';
import percentageChangeCalculatorSchema from './data/calculators/percentage-change-calculator.json';
import ratioCalculatorSchema from './data/calculators/ratio-calculator.json';
import ruleOfThreeCalculatorSchema from './data/calculators/rule-of-three-calculator.json';
import averageCalculatorSchema from './data/calculators/average-calculator.json';
// Expansión Geometría Adicional
import pythagoreanTheoremCalculatorSchema from './data/calculators/pythagorean-theorem-calculator.json';
import circleCalculatorSchema from './data/calculators/circle-calculator.json';
import triangleCalculatorSchema from './data/calculators/triangle-calculator.json';
import rectangleCalculatorSchema from './data/calculators/rectangle-calculator.json';
import cylinderVolumeAreaCalculatorSchema from './data/calculators/cylinder-volume-area-calculator.json';
import sphereVolumeAreaCalculatorSchema from './data/calculators/sphere-volume-area-calculator.json';
import coneVolumeAreaCalculatorSchema from './data/calculators/cone-volume-area-calculator.json';
import distanceBetweenTwoPointsCalculatorSchema from './data/calculators/distance-between-two-points-calculator.json';
import midpointCalculatorSchema from './data/calculators/midpoint-calculator.json';
import slopeOfLineCalculatorSchema from './data/calculators/slope-of-line-calculator.json';
// Expansión Salud y Medicina Avanzada (Bloque 1)
import kidneyStoneRecurrenceScoreCalculatorSchema from './data/calculators/kidney-stone-recurrence-score-calculator.json';
import glasgowComaScaleCalculatorSchema from './data/calculators/glasgow-coma-scale-calculator.json';
import apgarScoreCalculatorSchema from './data/calculators/apgar-score-calculator.json';
import chadsvascScoreCalculatorSchema from './data/calculators/chadsvasc-score-calculator.json';
import meldScoreCalculatorSchema from './data/calculators/meld-score-calculator.json';
import childPughScoreCalculatorSchema from './data/calculators/child-pugh-score-calculator.json';
import wellsScoreDvtPeCalculatorSchema from './data/calculators/wells-score-dvt-pe-calculator.json';
import curb65PneumoniaScoreCalculatorSchema from './data/calculators/curb65-pneumonia-score-calculator.json';
import hasBledBleedingRiskCalculatorSchema from './data/calculators/has-bled-bleeding-risk-calculator.json';
import graceAcuteCoronaryScoreCalculatorSchema from './data/calculators/grace-acute-coronary-score-calculator.json';
import timiRiskScoreCalculatorSchema from './data/calculators/timi-risk-score-calculator.json';
import apacheIiSeverityCalculatorSchema from './data/calculators/apache-ii-severity-calculator.json';
import sofaOrganFailureCalculatorSchema from './data/calculators/sofa-organ-failure-calculator.json';
import qsofaSepsisCalculatorSchema from './data/calculators/qsofa-sepsis-calculator.json';
import nihssStrokeScaleCalculatorSchema from './data/calculators/nihss-stroke-scale-calculator.json';
// Expansión Nutrición y Fitness (Bloque 2)
import ketoMacronutrientCalculatorSchema from './data/calculators/keto-macronutrient-calculator.json';
import intermittentFastingWindowCalculatorSchema from './data/calculators/intermittent-fasting-window-calculator.json';
import proteinIntakeBySportCalculatorSchema from './data/calculators/protein-intake-by-sport-calculator.json';
import carbCyclingPlanCalculatorSchema from './data/calculators/carb-cycling-plan-calculator.json';
import glycemicLoadCalculatorSchema from './data/calculators/glycemic-load-calculator.json';
import wilksCalculatorSchema from './data/calculators/wilks-calculator.json';
import rpeLoadCalculatorSchema from './data/calculators/rpe-load-calculator.json';
import marathonPaceSplitsCalculatorSchema from './data/calculators/marathon-pace-splits-calculator.json';
import ftpCyclingPowerCalculatorSchema from './data/calculators/ftp-cycling-power-calculator.json';
import heartRateZoneCalculatorSchema from './data/calculators/heart-rate-zone-calculator.json';
import ffmiFatFreeMassCalculatorSchema from './data/calculators/ffmi-fat-free-mass-calculator.json';
import bodyAdiposityIndexCalculatorSchema from './data/calculators/body-adiposity-index-calculator.json';
import waistToHeightRatioRiskCalculatorSchema from './data/calculators/waist-to-height-ratio-risk-calculator.json';
import somatotypeCalculatorSchema from './data/calculators/somatotype-calculator.json';
import electrolyteReplenishmentCalculatorSchema from './data/calculators/electrolyte-replenishment-calculator.json';
// Expansión Finanzas Avanzadas (Bloque 1)
import roicCalculatorSchema from './data/calculators/roic-calculator.json';
import waccCalculatorSchema from './data/calculators/wacc-calculator.json';
import dupontAnalysisCalculatorSchema from './data/calculators/dupont-analysis-calculator.json';
import dcfValuationCalculatorSchema from './data/calculators/dcf-valuation-calculator.json';
import evEbitdaMultipleCalculatorSchema from './data/calculators/ev-ebitda-multiple-calculator.json';
import blackScholesOptionCalculatorSchema from './data/calculators/black-scholes-option-calculator.json';
import sharpeRatioCalculatorSchema from './data/calculators/sharpe-ratio-calculator.json';
import sortinoRatioCalculatorSchema from './data/calculators/sortino-ratio-calculator.json';
import betaStockCalculatorSchema from './data/calculators/beta-stock-calculator.json';
import bondYieldToMaturityCalculatorSchema from './data/calculators/bond-yield-to-maturity-calculator.json';
import bondDurationConvexityCalculatorSchema from './data/calculators/bond-duration-convexity-calculator.json';
import capmRequiredReturnCalculatorSchema from './data/calculators/capm-required-return-calculator.json';
import freeCashFlowCalculatorSchema from './data/calculators/free-cash-flow-calculator.json';
import workingCapitalCalculatorSchema from './data/calculators/working-capital-calculator.json';
import altmanZScoreCalculatorSchema from './data/calculators/altman-z-score-calculator.json';
// Expansión Hipotecas y Créditos (Bloque 2)
import fhaMortgageCalculatorSchema from './data/calculators/fha-mortgage-calculator.json';
import vaMortgageCalculatorSchema from './data/calculators/va-mortgage-calculator.json';
import usdaMortgageCalculatorSchema from './data/calculators/usda-mortgage-calculator.json';
import jumboMortgageCalculatorSchema from './data/calculators/jumbo-mortgage-calculator.json';
import helocPaymentCalculatorSchema from './data/calculators/heloc-payment-calculator.json';
import reverseMortgageCalculatorSchema from './data/calculators/reverse-mortgage-calculator.json';
import biweeklyMortgageCalculatorSchema from './data/calculators/biweekly-mortgage-calculator.json';
import interestOnlyMortgageCalculatorSchema from './data/calculators/interest-only-mortgage-calculator.json';
import balloonLoanCalculatorSchema from './data/calculators/balloon-loan-calculator.json';
import commercialRealEstateLoanCalculatorSchema from './data/calculators/commercial-real-estate-loan-calculator.json';
import leaseVsBuyCarCalculatorSchema from './data/calculators/lease-vs-buy-car-calculator.json';
import autoRefinanceSavingsCalculatorSchema from './data/calculators/auto-refinance-savings-calculator.json';
import debtConsolidationCalculatorSchema from './data/calculators/debt-consolidation-calculator.json';
import paydayLoanAprCalculatorSchema from './data/calculators/payday-loan-apr-calculator.json';
import loanOriginationFeeCalculatorSchema from './data/calculators/loan-origination-fee-calculator.json';
// Expansión Ingeniería Eléctrica (Bloque 1)
import voltageDropCalculatorSchema from './data/calculators/voltage-drop-calculator.json';
import wireGaugeAmpacityCalculatorSchema from './data/calculators/wire-gauge-ampacity-calculator.json';
import threePhasePowerCalculatorSchema from './data/calculators/three-phase-power-calculator.json';
import powerFactorCorrectionCalculatorSchema from './data/calculators/power-factor-correction-calculator.json';
import transformerSizingCalculatorSchema from './data/calculators/transformer-sizing-calculator.json';
import kvaToKwCalculatorSchema from './data/calculators/kva-to-kw-calculator.json';
import conduitFillCalculatorSchema from './data/calculators/conduit-fill-calculator.json';
import shortCircuitCurrentCalculatorSchema from './data/calculators/short-circuit-current-calculator.json';
import resLcrResonanceCalculatorSchema from './data/calculators/res-lcr-resonance-calculator.json';
import batteryBankSizingCalculatorSchema from './data/calculators/battery-bank-sizing-calculator.json';
// Expansión Ingeniería Mecánica y Fluidos (Bloque 2)
import reynoldsNumberCalculatorSchema from './data/calculators/reynolds-number-calculator.json';
import darcyWeisbachFrictionCalculatorSchema from './data/calculators/darcy-weisbach-friction-calculator.json';
import hydraulicCylinderForceCalculatorSchema from './data/calculators/hydraulic-cylinder-force-calculator.json';
import pumpHeadHorsepowerCalculatorSchema from './data/calculators/pump-head-horsepower-calculator.json';
import gearRatioSpeedCalculatorSchema from './data/calculators/gear-ratio-speed-calculator.json';
import beltLengthPulleyCalculatorSchema from './data/calculators/belt-length-pulley-calculator.json';
import thermalExpansionCalculatorSchema from './data/calculators/thermal-expansion-calculator.json';
import hvacBtuCoolingCalculatorSchema from './data/calculators/hvac-btu-cooling-calculator.json';
import psychrometricAirCalculatorSchema from './data/calculators/psychrometric-air-calculator.json';
import airDuctSizingCalculatorSchema from './data/calculators/air-duct-sizing-calculator.json';
// Expansión Construcción y Reformas (Bloque 1)
import wallFramingStudsCalculatorSchema from './data/calculators/wall-framing-studs-calculator.json';
import drywallSheetsCalculatorSchema from './data/calculators/drywall-sheets-calculator.json';
import paintCoverageCalculatorSchema from './data/calculators/paint-coverage-calculator.json';
import brickBlockCalculatorSchema from './data/calculators/brick-block-calculator.json';
import rebarWeightCalculatorSchema from './data/calculators/rebar-weight-calculator.json';
import flooringPlankCalculatorSchema from './data/calculators/flooring-plank-calculator.json';
import insulationBattCalculatorSchema from './data/calculators/insulation-batt-calculator.json';
import pavingAsphaltCalculatorSchema from './data/calculators/paving-asphalt-calculator.json';
import fenceMaterialsCalculatorSchema from './data/calculators/fence-materials-calculator.json';
import retainingWallCalculatorSchema from './data/calculators/retaining-wall-calculator.json';
// Expansión Hogar y Vida Cotidiana (Bloque 2)
import solarPanelPaybackCalculatorSchema from './data/calculators/solar-panel-payback-calculator.json';
import applianceEnergyCostCalculatorSchema from './data/calculators/appliance-energy-cost-calculator.json';
import lawnMowingAreaCalculatorSchema from './data/calculators/lawn-mowing-area-calculator.json';
import treeMulchRingCalculatorSchema from './data/calculators/tree-mulch-ring-calculator.json';
import swimmingPoolWaterVolumeCalculatorSchema from './data/calculators/swimming-pool-water-volume-calculator.json';
import raffleTicketProbabilityCalculatorSchema from './data/calculators/raffle-ticket-probability-calculator.json';
import pokerHandProbabilityCalculatorSchema from './data/calculators/poker-hand-probability-calculator.json';
import boardGameScoreCalculatorSchema from './data/calculators/board-game-score-calculator.json';
import waterHeaterEnergyCalculatorSchema from './data/calculators/water-heater-energy-calculator.json';
import compostCnRatioCalculatorSchema from './data/calculators/compost-cn-ratio-calculator.json';
// Expansión Tecnología y Electrónica (Bloque 3)
import ledResistorCalculatorSchema from './data/calculators/led-resistor-calculator.json';
import batteryLifeRuntimeCalculatorSchema from './data/calculators/battery-life-runtime-calculator.json';
import capacitorEnergyChargeCalculatorSchema from './data/calculators/capacitor-energy-charge-calculator.json';
import rcFilterCutoffFrequencyCalculatorSchema from './data/calculators/rc-filter-cutoff-frequency-calculator.json';
import pingLatencyJitterCalculatorSchema from './data/calculators/ping-latency-jitter-calculator.json';
import screenPpiDensityCalculatorSchema from './data/calculators/screen-ppi-density-calculator.json';
import binaryHexConverterCalculatorSchema from './data/calculators/binary-hex-converter-calculator.json';
import pcbTraceCurrentWidthCalculatorSchema from './data/calculators/pcb-trace-current-width-calculator.json';
import attenuatorDbCalculatorSchema from './data/calculators/attenuator-db-calculator.json';
import raidStorageCapacityCalculatorSchema from './data/calculators/raid-storage-capacity-calculator.json';
// Expansión Conversores (Bloque 1)
import lengthDistanceConverterSchema from './data/calculators/length-distance-converter.json';
import massWeightConverterSchema from './data/calculators/mass-weight-converter.json';
import volumeLiquidConverterSchema from './data/calculators/volume-liquid-converter.json';
import temperatureUnitConverterSchema from './data/calculators/temperature-unit-converter.json';
import areaLandConverterSchema from './data/calculators/area-land-converter.json';
import speedVelocityConverterSchema from './data/calculators/speed-velocity-converter.json';
import digitalDataStorageConverterSchema from './data/calculators/digital-data-storage-converter.json';
import pressureUnitConverterSchema from './data/calculators/pressure-unit-converter.json';
import energyPowerConverterSchema from './data/calculators/energy-power-converter.json';
import torqueUnitConverterSchema from './data/calculators/torque-unit-converter.json';
import angleUnitConverterSchema from './data/calculators/angle-unit-converter.json';
import fuelEconomyConverterSchema from './data/calculators/fuel-economy-converter.json';
import currencyExchangeRateConverterSchema from './data/calculators/currency-exchange-rate-converter.json';
import dataTransferRateConverterSchema from './data/calculators/data-transfer-rate-converter.json';
import cookingLiquidMeasurementConverterSchema from './data/calculators/cooking-liquid-measurement-converter.json';
// Expansión Fecha y Tiempo (Bloque 2)
import exactAgeCalculatorSchema from './data/calculators/exact-age-calculator.json';
import dateDifferenceDaysCalculatorSchema from './data/calculators/date-difference-days-calculator.json';
import dateAddSubtractDaysCalculatorSchema from './data/calculators/date-add-subtract-days-calculator.json';
import businessWorkingDaysCalculatorSchema from './data/calculators/business-working-days-calculator.json';
import workHoursTimesheetCalculatorSchema from './data/calculators/work-hours-timesheet-calculator.json';
import timeDurationAdditionCalculatorSchema from './data/calculators/time-duration-addition-calculator.json';
import timeZoneDifferenceCalculatorSchema from './data/calculators/time-zone-difference-calculator.json';
import timeZoneCalculatorSchema from './data/calculators/time-zone-calculator.json';
import pregnancyDueDateCalendarCalculatorSchema from './data/calculators/pregnancy-due-date-calendar-calculator.json';
import dayOfWeekBornCalculatorSchema from './data/calculators/day-of-week-born-calculator.json';
import chronologicalAgeMonthsCalculatorSchema from './data/calculators/chronologicalAgeMonths-calculator.json';
// Expansión Transporte y Vehículos (Bloque 3)
import worldCitiesFlightDistanceCalculatorSchema from './data/calculators/world-cities-flight-distance-calculator.json';
import tripFuelCostCalculatorSchema from './data/calculators/trip-fuel-cost-calculator.json';
import gasMileageMpgL100kmCalculatorSchema from './data/calculators/gas-mileage-mpg-l100km-calculator.json';
import irsStandardMileageReimbursementCalculatorSchema from './data/calculators/irs-standard-mileage-reimbursement-calculator.json';
import carEvChargingCostRuntimeCalculatorSchema from './data/calculators/car-ev-charging-cost-runtime-calculator.json';
import carDepreciationValueCalculatorSchema from './data/calculators/car-depreciation-value-calculator.json';
import fleetVehicleOperatingCostCalculatorSchema from './data/calculators/fleet-vehicle-operating-cost-calculator.json';
import truckingFreightCostPerMileCalculatorSchema from './data/calculators/trucking-freight-cost-per-mile-calculator.json';
import speedDistanceTimeTravelCalculatorSchema from './data/calculators/speed-distance-time-travel-calculator.json';
import boatMarineFuelConsumptionCalculatorSchema from './data/calculators/boat-marine-fuel-consumption-calculator.json';

const RAW_CALCULATORS = [
  percentageSchema,
  bmiSchema,
  mortgageSchema,
  autoLoanSchema,
  compoundInterestSchema,
  retirement401kSchema,
  salaryTakeHomeSchema,
  roiCalculatorSchema,
  budget503020Schema,
  amortizationCalculatorSchema,
  mortgagePayoffCalculatorSchema,
  houseAffordabilityCalculatorSchema,
  rentCalculatorSchema,
  dtiRatioCalculatorSchema,
  debtSnowballCalculatorSchema,
  creditCardPayoffCalculatorSchema,
  studentLoanPayoffCalculatorSchema,
  personalLoanCalculatorSchema,
  inflationCalculatorSchema,
  emergencyFundCalculatorSchema,
  simpleInterestCalculatorSchema,
  netWorthCalculatorSchema,
  investmentReturnCalculatorSchema,
  dividendYieldCalculatorSchema,
  stockProfitCalculatorSchema,
  cryptoProfitCalculatorSchema,
  cagrCalculatorSchema,
  ruleOf72CalculatorSchema,
  presentValueCalculatorSchema,
  futureValueCalculatorSchema,
  npvCalculatorSchema,
  irrCalculatorSchema,
  salesTaxCalculatorSchema,
  vatCalculatorSchema,
  capitalGainsTaxCalculatorSchema,
  propertyTaxCalculatorSchema,
  calorieNeedsSchema,
  macroNutrientSchema,
  bodyFatSchema,
  bmrCalculatorSchema,
  tdeeCalculatorSchema,
  idealBodyWeightCalculatorSchema,
  leanBodyMassCalculatorSchema,
  waistToHipRatioCalculatorSchema,
  waistToHeightRatioCalculatorSchema,
  bodySurfaceAreaCalculatorSchema,
  waterIntakeCalculatorSchema,
  targetHeartRateCalculatorSchema,
  vo2MaxCalculatorSchema,
  oneRepMaxCalculatorSchema,
  paceCalculatorSchema,
  caloriesBurnedRunningCalculatorSchema,
  caloriesBurnedWalkingCalculatorSchema,
  caloriesBurnedCyclingCalculatorSchema,
  caloriesBurnedSwimmingCalculatorSchema,
  stepsToMilesKmCalculatorSchema,
  pregnancyDueDateCalculatorSchema,
  ovulationFertilityCalculatorSchema,
  periodTrackerCycleCalculatorSchema,
  bloodPressureCategoryCalculatorSchema,
  bloodSugarA1cConverterSchema,
  gfrKidneyFunctionCalculatorSchema,
  cholesterolRatiosCalculatorSchema,
  meanArterialPressureCalculatorSchema,
  ivDripRateCalculatorSchema,
  pediatricDosageByWeightCalculatorSchema,
  fractionCalculatorSchema,
  scientificNotationCalculatorSchema,
  matrixMultiplicationCalculatorSchema,
  quadraticEquationSolverSchema,
  areaCalculatorSchema,
  volumeCalculatorSchema,
  speedVelocityCalculatorSchema,
  accelerationCalculatorSchema,
  forceMassAccelerationCalculatorSchema,
  workEnergyCalculatorSchema,
  kineticEnergyCalculatorSchema,
  potentialEnergyCalculatorSchema,
  powerWorkTimeCalculatorSchema,
  momentumMassVelocityCalculatorSchema,
  torqueForceDistanceCalculatorSchema,
  pressureForceAreaCalculatorSchema,
  densityMassVolumeCalculatorSchema,
  idealGasLawCalculatorSchema,
  boylesLawCalculatorSchema,
  ohmsLawCalculatorSchema,
  meanMedianModeSchema,
  standardDeviationCalculatorSchema,
  zScoreCalculatorSchema,
  confidenceIntervalCalculatorSchema,
  marginOfErrorCalculatorSchema,
  sampleSizeCalculatorSchema,
  pValueCalculatorSchema,
  simpleProbabilityCalculatorSchema,
  combinationsPermutationsCalculatorSchema,
  coinFlipProbabilityCalculatorSchema,
  diceRollProbabilityCalculatorSchema,
  concreteVolumeCalculatorSchema,
  beamDeflectionCalculatorSchema,
  pipeFlowRateCalculatorSchema,
  heatLossCalculatorSchema,
  molesToGramsCalculatorSchema,
  molarityCalculatorSchema,
  solutionDilutionCalculatorSchema,
  phCalculatorSchema,
  halfLifeCalculatorSchema,
  radioactiveDecayCalculatorSchema,
  stoichiometryCalculatorSchema,
  percentYieldCalculatorSchema,
  empiricalFormulaCalculatorSchema,
  gasLawCombinedCalculatorSchema,
  pendulumPeriodCalculatorSchema,
  snellsLawRefractionCalculatorSchema,
  projectileMotionCalculatorSchema,
  dopplerEffectCalculatorSchema,
  gravitationalForceCalculatorSchema,
  coulombLawCalculatorSchema,
  waveSpeedCalculatorSchema,
  bernoulliPressureCalculatorSchema,
  CarnotEfficiencyCalculatorSchema,
  photonEnergyCalculatorSchema,
  varianceCalculatorSchema,
  interquartileRangeIqrCalculatorSchema,
  percentileRankCalculatorSchema,
  linearRegressionCalculatorSchema,
  chiSquareTestCalculatorSchema,
  tTestOneSampleCalculatorSchema,
  binomialDistributionCalculatorSchema,
  poissonDistributionCalculatorSchema,
  normalDistributionCdfCalculatorSchema,
  bayesTheoremCalculatorSchema,
  logarithmCalculatorSchema,
  exponentPowerCalculatorSchema,
  factorCalculatorSchema,
  gcdLcmCalculatorSchema,
  primeFactorizationCalculatorSchema,
  percentageDifferenceCalculatorSchema,
  percentageChangeCalculatorSchema,
  ratioCalculatorSchema,
  ruleOfThreeCalculatorSchema,
  averageCalculatorSchema,
  pythagoreanTheoremCalculatorSchema,
  circleCalculatorSchema,
  triangleCalculatorSchema,
  rectangleCalculatorSchema,
  cylinderVolumeAreaCalculatorSchema,
  sphereVolumeAreaCalculatorSchema,
  coneVolumeAreaCalculatorSchema,
  distanceBetweenTwoPointsCalculatorSchema,
  midpointCalculatorSchema,
  slopeOfLineCalculatorSchema,
  kidneyStoneRecurrenceScoreCalculatorSchema,
  glasgowComaScaleCalculatorSchema,
  apgarScoreCalculatorSchema,
  chadsvascScoreCalculatorSchema,
  meldScoreCalculatorSchema,
  childPughScoreCalculatorSchema,
  wellsScoreDvtPeCalculatorSchema,
  curb65PneumoniaScoreCalculatorSchema,
  hasBledBleedingRiskCalculatorSchema,
  graceAcuteCoronaryScoreCalculatorSchema,
  timiRiskScoreCalculatorSchema,
  apacheIiSeverityCalculatorSchema,
  sofaOrganFailureCalculatorSchema,
  qsofaSepsisCalculatorSchema,
  nihssStrokeScaleCalculatorSchema,
  ketoMacronutrientCalculatorSchema,
  intermittentFastingWindowCalculatorSchema,
  proteinIntakeBySportCalculatorSchema,
  carbCyclingPlanCalculatorSchema,
  glycemicLoadCalculatorSchema,
  wilksCalculatorSchema,
  rpeLoadCalculatorSchema,
  marathonPaceSplitsCalculatorSchema,
  ftpCyclingPowerCalculatorSchema,
  heartRateZoneCalculatorSchema,
  ffmiFatFreeMassCalculatorSchema,
  bodyAdiposityIndexCalculatorSchema,
  waistToHeightRatioRiskCalculatorSchema,
  somatotypeCalculatorSchema,
  electrolyteReplenishmentCalculatorSchema,
  roicCalculatorSchema,
  waccCalculatorSchema,
  dupontAnalysisCalculatorSchema,
  dcfValuationCalculatorSchema,
  evEbitdaMultipleCalculatorSchema,
  blackScholesOptionCalculatorSchema,
  sharpeRatioCalculatorSchema,
  sortinoRatioCalculatorSchema,
  betaStockCalculatorSchema,
  bondYieldToMaturityCalculatorSchema,
  bondDurationConvexityCalculatorSchema,
  capmRequiredReturnCalculatorSchema,
  freeCashFlowCalculatorSchema,
  workingCapitalCalculatorSchema,
  altmanZScoreCalculatorSchema,
  fhaMortgageCalculatorSchema,
  vaMortgageCalculatorSchema,
  usdaMortgageCalculatorSchema,
  jumboMortgageCalculatorSchema,
  helocPaymentCalculatorSchema,
  reverseMortgageCalculatorSchema,
  biweeklyMortgageCalculatorSchema,
  interestOnlyMortgageCalculatorSchema,
  balloonLoanCalculatorSchema,
  commercialRealEstateLoanCalculatorSchema,
  leaseVsBuyCarCalculatorSchema,
  autoRefinanceSavingsCalculatorSchema,
  debtConsolidationCalculatorSchema,
  paydayLoanAprCalculatorSchema,
  loanOriginationFeeCalculatorSchema,
  voltageDropCalculatorSchema,
  wireGaugeAmpacityCalculatorSchema,
  threePhasePowerCalculatorSchema,
  powerFactorCorrectionCalculatorSchema,
  transformerSizingCalculatorSchema,
  kvaToKwCalculatorSchema,
  conduitFillCalculatorSchema,
  shortCircuitCurrentCalculatorSchema,
  resLcrResonanceCalculatorSchema,
  batteryBankSizingCalculatorSchema,
  reynoldsNumberCalculatorSchema,
  darcyWeisbachFrictionCalculatorSchema,
  hydraulicCylinderForceCalculatorSchema,
  pumpHeadHorsepowerCalculatorSchema,
  gearRatioSpeedCalculatorSchema,
  beltLengthPulleyCalculatorSchema,
  thermalExpansionCalculatorSchema,
  hvacBtuCoolingCalculatorSchema,
  psychrometricAirCalculatorSchema,
  airDuctSizingCalculatorSchema,
  wallFramingStudsCalculatorSchema,
  drywallSheetsCalculatorSchema,
  paintCoverageCalculatorSchema,
  brickBlockCalculatorSchema,
  rebarWeightCalculatorSchema,
  flooringPlankCalculatorSchema,
  insulationBattCalculatorSchema,
  pavingAsphaltCalculatorSchema,
  fenceMaterialsCalculatorSchema,
  retainingWallCalculatorSchema,
  solarPanelPaybackCalculatorSchema,
  applianceEnergyCostCalculatorSchema,
  lawnMowingAreaCalculatorSchema,
  treeMulchRingCalculatorSchema,
  swimmingPoolWaterVolumeCalculatorSchema,
  raffleTicketProbabilityCalculatorSchema,
  pokerHandProbabilityCalculatorSchema,
  boardGameScoreCalculatorSchema,
  waterHeaterEnergyCalculatorSchema,
  compostCnRatioCalculatorSchema,
  ledResistorCalculatorSchema,
  batteryLifeRuntimeCalculatorSchema,
  capacitorEnergyChargeCalculatorSchema,
  rcFilterCutoffFrequencyCalculatorSchema,
  pingLatencyJitterCalculatorSchema,
  screenPpiDensityCalculatorSchema,
  binaryHexConverterCalculatorSchema,
  pcbTraceCurrentWidthCalculatorSchema,
  attenuatorDbCalculatorSchema,
  raidStorageCapacityCalculatorSchema,
  lengthDistanceConverterSchema,
  massWeightConverterSchema,
  volumeLiquidConverterSchema,
  temperatureUnitConverterSchema,
  areaLandConverterSchema,
  speedVelocityConverterSchema,
  digitalDataStorageConverterSchema,
  pressureUnitConverterSchema,
  energyPowerConverterSchema,
  torqueUnitConverterSchema,
  angleUnitConverterSchema,
  fuelEconomyConverterSchema,
  currencyExchangeRateConverterSchema,
  dataTransferRateConverterSchema,
  cookingLiquidMeasurementConverterSchema,
  exactAgeCalculatorSchema,
  dateDifferenceDaysCalculatorSchema,
  dateAddSubtractDaysCalculatorSchema,
  businessWorkingDaysCalculatorSchema,
  workHoursTimesheetCalculatorSchema,
  timeDurationAdditionCalculatorSchema,
  timeZoneDifferenceCalculatorSchema,
  timeZoneCalculatorSchema,
  pregnancyDueDateCalendarCalculatorSchema,
  dayOfWeekBornCalculatorSchema,
  chronologicalAgeMonthsCalculatorSchema,
  worldCitiesFlightDistanceCalculatorSchema,
  tripFuelCostCalculatorSchema,
  gasMileageMpgL100kmCalculatorSchema,
  irsStandardMileageReimbursementCalculatorSchema,
  carEvChargingCostRuntimeCalculatorSchema,
  carDepreciationValueCalculatorSchema,
  fleetVehicleOperatingCostCalculatorSchema,
  truckingFreightCostPerMileCalculatorSchema,
  speedDistanceTimeTravelCalculatorSchema,
  boatMarineFuelConsumptionCalculatorSchema
];

export default function App() {
  const [lang, setLang] = useState('en'); // INGLÉS POR DEFECTO
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'category' | 'calculator'
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCalculatorRaw, setActiveCalculatorRaw] = useState(null);
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | 'about'

  const t = i18n[lang] || i18n.en;

  // Traducir todas las calculadoras activas automáticamente en el cliente
  const translatedCalculators = useMemo(() => {
    return RAW_CALCULATORS.map((calc) => translateSchema(calc, lang));
  }, [lang]);

  const activeCalculator = useMemo(() => {
    if (!activeCalculatorRaw) return null;
    return translateSchema(activeCalculatorRaw, lang);
  }, [activeCalculatorRaw, lang]);

  // Sincronizar estado de la App con la URL del navegador y soporte de Botón Atrás (popstate)
  const syncRouteFromUrl = () => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) {
      setViewMode('home');
      setActiveCategory(null);
      setActiveCalculatorRaw(null);
      setLegalModal(null);
    } else if (['privacy', 'terms', 'about'].includes(parts[0])) {
      setLegalModal(parts[0]);
      setViewMode('legal');
      setActiveCategory(null);
      setActiveCalculatorRaw(null);
    } else if (parts.length === 1) {
      const catId = parts[0];
      setActiveCategory(catId);
      setViewMode('category');
      setActiveCalculatorRaw(null);
      setLegalModal(null);
    } else if (parts.length === 2) {
      const catId = parts[0];
      const calcSlug = parts[1];
      const found = RAW_CALCULATORS.find((c) => c.meta.slug === calcSlug || c.meta.id === calcSlug);
      if (found) {
        setActiveCategory(catId);
        setActiveCalculatorRaw(found);
        setViewMode('calculator');
        setLegalModal(null);
      } else {
        setActiveCategory(catId);
        setViewMode('category');
        setLegalModal(null);
      }
    }
  };

  useEffect(() => {
    syncRouteFromUrl();
    const handlePopState = () => {
      syncRouteFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Actualizar document.title y Meta SEO dinámicamente
  useEffect(() => {
    if (viewMode === 'calculator' && activeCalculator) {
      document.title = `${activeCalculator.meta.title} — FindCalculator`;
    } else if (viewMode === 'category' && activeCategory) {
      document.title = `${activeCategory.toUpperCase()} Calculators — FindCalculator`;
    } else if (legalModal) {
      document.title = `${legalModal.toUpperCase()} — FindCalculator`;
    } else {
      document.title = `FindCalculator — 330+ Calculadoras Gratis en Tiempo Real`;
    }
  }, [viewMode, activeCalculator, activeCategory, legalModal, lang]);

  // Toggle de Idioma EN <-> ES
  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  // Toggle de Tema Claro / Oscuro
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGoHome = (pushUrl = true) => {
    if (pushUrl && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setViewMode('home');
    setActiveCategory(null);
    setActiveCalculatorRaw(null);
    setLegalModal(null);
    setSearchQuery('');
  };

  const handleSelectCategory = (catId, pushUrl = true) => {
    if (pushUrl && window.location.pathname !== `/${catId}`) {
      window.history.pushState({}, '', `/${catId}`);
    }
    setActiveCategory(catId);
    setViewMode('category');
    setActiveCalculatorRaw(null);
    setLegalModal(null);
  };

  const handleSelectCalculator = (calc, pushUrl = true) => {
    const original = RAW_CALCULATORS.find((c) => c.meta.id === calc.meta.id) || calc;
    const cat = original.meta.category || 'herramientas';
    const slug = original.meta.slug || original.meta.id;

    if (pushUrl && window.location.pathname !== `/${cat}/${slug}`) {
      window.history.pushState({}, '', `/${cat}/${slug}`);
    }
    setActiveCalculatorRaw(original);
    setViewMode('calculator');
    setLegalModal(null);
  };

  const handleOpenLegal = (type, pushUrl = true) => {
    if (pushUrl && window.location.pathname !== `/${type}`) {
      window.history.pushState({}, '', `/${type}`);
    }
    setLegalModal(type);
    setViewMode('legal');
    setActiveCategory(null);
    setActiveCalculatorRaw(null);
  };

  const handleCloseLegal = () => {
    setLegalModal(null);
    if (['/privacy', '/terms', '/about'].includes(window.location.pathname)) {
      window.history.back();
    }
  };

  // Función al presionar el botón de Atrás en la interfaz
  const handleBackToCategoryOrHome = () => {
    if (viewMode === 'calculator' && activeCategory) {
      handleSelectCategory(activeCategory);
    } else {
      handleGoHome();
    }
  };

  return (
    <ErrorBoundary onReset={handleGoHome}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
        {/* Header global con Buscador Flotante Instantáneo, Menú Móvil e i18n */}
        <Header
          lang={lang}
          onToggleLang={toggleLang}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onGoHome={handleGoHome}
          calculators={translatedCalculators}
          onSelectCalculator={handleSelectCalculator}
        />

        {/* Contenido Principal según el Modo de Vista */}
        <main style={{ flex: 1 }}>
          {legalModal ? (
            /* PÁGINAS LEÍBLES DEDICADAS (Privacy Policy, Terms of Use, About Us) */
            <LegalView type={legalModal} onBackHome={handleGoHome} lang={lang} />
          ) : viewMode === 'calculator' && activeCalculator ? (
            <div>
              <div style={{ maxWidth: '1200px', margin: '16px auto 0', padding: '0 16px' }}>
                <button onClick={handleBackToCategoryOrHome} className="btn-secondary" style={{ height: '32px', fontSize: '0.8125rem' }}>
                  ← {t.nav.backToCatalog}
                </button>
              </div>

              <CalculatorRenderer schema={activeCalculator} lang={lang} />
            </div>
          ) : viewMode === 'category' && activeCategory ? (
            /* PÁGINA DEDICADA ESPECÍFICA POR CATEGORÍA */
            <CategoryView
              categoryId={activeCategory}
              lang={lang}
              calculators={translatedCalculators}
              onSelectCalculator={handleSelectCalculator}
              onBackHome={handleGoHome}
            />
          ) : (
            /* PÁGINA DE INICIO INTERACTIVA POR DEFECTO */
            <HomeInteractive
              lang={lang}
              calculators={translatedCalculators}
              onSelectCalculator={handleSelectCalculator}
              searchQuery={searchQuery}
            />
          )}
        </main>

        {/* Footer global */}
        <Footer lang={lang} onOpenLegal={(type) => handleOpenLegal(type)} />

        {/* Modal/Páginas Legales Requeridas por Google AdSense */}
        <LegalPages type={legalModal} onClose={handleCloseLegal} lang={lang} />
      </div>
    </ErrorBoundary>
  );
}
