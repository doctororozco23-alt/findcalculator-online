import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorRenderer from './components/CalculatorRenderer';
import HomeInteractive from './components/HomeInteractive';
import CategoryView from './components/CategoryView';
import ErrorBoundary from './components/ErrorBoundary';
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
import realEstateCalculatorSchema from './data/calculators/real-estate-calculator.json';
import refinanceCalculatorSchema from './data/calculators/refinance-calculator.json';
import rentalPropertyCalculatorSchema from './data/calculators/rental-property-calculator.json';
import aprCalculatorSchema from './data/calculators/apr-calculator.json';
import fhaLoanCalculatorSchema from './data/calculators/fha-loan-calculator.json';
import vaMortgageCalculatorSchema from './data/calculators/va-mortgage-calculator.json';
import homeEquityCalculatorSchema from './data/calculators/home-equity-calculator.json';
import helocCalculatorSchema from './data/calculators/heloc-calculator.json';
import downPaymentCalculatorSchema from './data/calculators/down-payment-calculator.json';
import rentVsBuyCalculatorSchema from './data/calculators/rent-vs-buy-calculator.json';
import autoLeaseCalculatorSchema from './data/calculators/auto-lease-calculator.json';
import cashbackVsLowInterestCalculatorSchema from './data/calculators/cashback-vs-low-interest-calculator.json';
import simpleInterestCalculatorSchema from './data/calculators/simple-interest-calculator.json';
import investmentCalculatorSchema from './data/calculators/investment-calculator.json';
import cdCalculatorSchema from './data/calculators/cd-calculator.json';
import bondCalculatorSchema from './data/calculators/bond-calculator.json';
import mutualFundCalculatorSchema from './data/calculators/mutual-fund-calculator.json';
import averageReturnCalculatorSchema from './data/calculators/average-return-calculator.json';
import irrCalculatorSchema from './data/calculators/irr-calculator.json';
import paybackPeriodCalculatorSchema from './data/calculators/payback-period-calculator.json';
import presentValueCalculatorSchema from './data/calculators/present-value-calculator.json';
import futureValueCalculatorSchema from './data/calculators/future-value-calculator.json';
import savingsCalculatorSchema from './data/calculators/savings-calculator.json';
import pensionCalculatorSchema from './data/calculators/pension-calculator.json';
import annuityPayoutCalculatorSchema from './data/calculators/annuity-payout-calculator.json';
import rothIraCalculatorSchema from './data/calculators/roth-ira-calculator.json';
import iraCalculatorSchema from './data/calculators/ira-calculator.json';
import rmdCalculatorSchema from './data/calculators/rmd-calculator.json';
import socialSecurityCalculatorSchema from './data/calculators/social-security-calculator.json';
import fireCalculatorSchema from './data/calculators/fire-calculator.json';
import estateTaxCalculatorSchema from './data/calculators/estate-tax-calculator.json';
import inflationCalculatorSchema from './data/calculators/inflation-calculator.json';
import salesTaxCalculatorSchema from './data/calculators/sales-tax-calculator.json';
import creditCardPayoffCalculatorSchema from './data/calculators/credit-card-payoff-calculator.json';
import personalLoanCalculatorSchema from './data/calculators/personal-loan-calculator.json';
import studentLoanCalculatorSchema from './data/calculators/student-loan-calculator.json';
import debtPayoffCalculatorSchema from './data/calculators/debt-payoff-calculator.json';
import balanceTransferCalculatorSchema from './data/calculators/balance-transfer-calculator.json';
import breakEvenCalculatorSchema from './data/calculators/break-even-calculator.json';
import marginCalculatorSchema from './data/calculators/margin-calculator.json';
import ebitdaCalculatorSchema from './data/calculators/ebitda-calculator.json';
import dcfCalculatorSchema from './data/calculators/dcf-calculator.json';
import businessLoanCalculatorSchema from './data/calculators/business-loan-calculator.json';
import commissionCalculatorSchema from './data/calculators/commission-calculator.json';
import npvCalculatorSchema from './data/calculators/npv-calculator.json';
import workingCapitalCalculatorSchema from './data/calculators/working-capital-calculator.json';
import burnRateCalculatorSchema from './data/calculators/burn-rate-calculator.json';
import financialRatiosCalculatorSchema from './data/calculators/financial-ratios-calculator.json';

// Lote 1 Salud / Fitness / Nutrición
import calorieCalculatorSchema from './data/calculators/calorie-calculator.json';
import bodyFatCalculatorSchema from './data/calculators/body-fat-calculator.json';
import bmrCalculatorSchema from './data/calculators/bmr-calculator.json';
import macroCalculatorSchema from './data/calculators/macro-calculator.json';
import idealWeightCalculatorSchema from './data/calculators/ideal-weight-calculator.json';

// Lote 2 Salud / Fitness / Nutrición
import pregnancyCalculatorSchema from './data/calculators/pregnancy-calculator.json';
import pregnancyWeightGainCalculatorSchema from './data/calculators/pregnancy-weight-gain-calculator.json';
import pregnancyConceptionCalculatorSchema from './data/calculators/pregnancy-conception-calculator.json';
import dueDateCalculatorSchema from './data/calculators/due-date-calculator.json';
import paceCalculatorSchema from './data/calculators/pace-calculator.json';
import pregnancyUltrasoundCalculatorSchema from './data/calculators/pregnancy-ultrasound-calculator.json';

// Lote 3 Salud / Fitness / Nutrición
import armyBodyFatCalculatorSchema from './data/calculators/army-body-fat-calculator.json';
import carbohydrateCalculatorSchema from './data/calculators/carbohydrate-calculator.json';
import leanBodyMassCalculatorSchema from './data/calculators/lean-body-mass-calculator.json';
import healthyWeightCalculatorSchema from './data/calculators/healthy-weight-calculator.json';
import caloriesBurnedCalculatorSchema from './data/calculators/calories-burned-calculator.json';

// Lote 4 Salud / Fitness / Nutrición
import oneRepMaxCalculatorSchema from './data/calculators/one-rep-max-calculator.json';
import targetHeartRateCalculatorSchema from './data/calculators/target-heart-rate-calculator.json';
import proteinCalculatorSchema from './data/calculators/protein-calculator.json';
import fatIntakeCalculatorSchema from './data/calculators/fat-intake-calculator.json';
import tdeeCalculatorSchema from './data/calculators/tdee-calculator.json';

// Lote 5 Salud / Fitness / Nutrición
import waterIntakeCalculatorSchema from './data/calculators/water-intake-calculator.json';
import bmiPrimeCalculatorSchema from './data/calculators/bmi-prime-calculator.json';
import bodyAdiposityIndexCalculatorSchema from './data/calculators/body-adiposity-index-calculator.json';
import waistToHeightRatioCalculatorSchema from './data/calculators/waist-to-height-ratio-calculator.json';
import waistToHipRatioCalculatorSchema from './data/calculators/waist-to-hip-ratio-calculator.json';

// Lote 6 Salud / Fitness / Nutrición
import sleepCalculatorSchema from './data/calculators/sleep-calculator.json';
import pediatricBmiCalculatorSchema from './data/calculators/pediatric-bmi-calculator.json';
import targetWeightCalculatorSchema from './data/calculators/target-weight-calculator.json';
import vo2MaxCalculatorSchema from './data/calculators/vo2-max-calculator.json';
import runningRacePredictorCalculatorSchema from './data/calculators/running-race-predictor-calculator.json';

// Lote 7 Salud (Expansión Categoría Health)
import ovulationCalculatorSchema from './data/calculators/ovulation-calculator.json';
import bloodPressureCalculatorSchema from './data/calculators/blood-pressure-calculator.json';
import bloodSugarConverterCalculatorSchema from './data/calculators/blood-sugar-converter-calculator.json';
import chronotypeSleepCalculatorSchema from './data/calculators/chronotype-sleep-calculator.json';
import childHeightPredictorCalculatorSchema from './data/calculators/child-height-predictor-calculator.json';

// Lote 8 Fitness (Expansión Categoría Fitness)
import ffmiCalculatorSchema from './data/calculators/ffmi-calculator.json';
import wilksCalculatorSchema from './data/calculators/wilks-calculator.json';
import creatineDosingCalculatorSchema from './data/calculators/creatine-dosing-calculator.json';
import heartRateRunningZonesCalculatorSchema from './data/calculators/heart-rate-running-zones-calculator.json';
import treadmillInclineCalculatorSchema from './data/calculators/treadmill-incline-calculator.json';

// Lote 9 Nutrición (Expansión Categoría Food)
import glycemicIndexLoadCalculatorSchema from './data/calculators/glycemic-index-load-calculator.json';
import electrolyteIntakeCalculatorSchema from './data/calculators/electrolyte-intake-calculator.json';
import ketoCalculatorSchema from './data/calculators/keto-calculator.json';
import intermittentFastingCalculatorSchema from './data/calculators/intermittent-fasting-calculator.json';
import cookingUnitsConverterCalculatorSchema from './data/calculators/cooking-units-converter-calculator.json';

// Lote 10 Médica / Nefrología (Expansión Health Indicators)
import egfrCkdEpiCalculatorSchema from './data/calculators/egfr-ckd-epi-calculator.json';
import creatinineClearanceCockcroftGaultCalculatorSchema from './data/calculators/creatinine-clearance-cockcroft-gault-calculator.json';
import fenaFractionalExcretionSodiumCalculatorSchema from './data/calculators/fena-fractional-excretion-sodium-calculator.json';
import anionGapCorrectedCalculatorSchema from './data/calculators/anion-gap-corrected-calculator.json';
import correctedCalciumAlbuminCalculatorSchema from './data/calculators/corrected-calcium-albumin-calculator.json';

// Lote 11 Médica / Cardiología & Urgencias (Expansión Health Indicators)
import chads2VascScoreCalculatorSchema from './data/calculators/chads2-vasc-score-calculator.json';
import hasBledScoreCalculatorSchema from './data/calculators/has-bled-score-calculator.json';
import heartScoreCardiacRiskCalculatorSchema from './data/calculators/heart-score-cardiac-risk-calculator.json';
import qtcIntervalCalculatorSchema from './data/calculators/qtc-interval-calculator.json';
import astrupBloodGasInterpreterCalculatorSchema from './data/calculators/astrup-blood-gas-interpreter-calculator.json';

// Lote 12 Urgencias, Hepatología y Neurología Intensiva (Expansión Health Indicators)
import wellsScoreDvtPeCalculatorSchema from './data/calculators/wells-score-dvt-pe-calculator.json';
import curb65PneumoniaSeverityCalculatorSchema from './data/calculators/curb-65-pneumonia-severity-calculator.json';
import childPughScoreCalculatorSchema from './data/calculators/child-pugh-score-calculator.json';
import meldScoreCalculatorSchema from './data/calculators/meld-score-calculator.json';
import glasgowComaScaleGcsCalculatorSchema from './data/calculators/glasgow-coma-scale-gcs-calculator.json';

// Lote 13 Sepsis, Pediatría y Fluidoterapia Hospitalaria (Expansión Health Indicators)
import sofaScoreSepsisCalculatorSchema from './data/calculators/sofa-score-sepsis-calculator.json';
import pao2Fio2RatioPafiCalculatorSchema from './data/calculators/pao2-fio2-ratio-pafi-calculator.json';
import hollidaySegarMaintenanceFluidsCalculatorSchema from './data/calculators/holliday-segar-maintenance-fluids-calculator.json';
import apgarScoreCalculatorSchema from './data/calculators/apgar-score-calculator.json';
import pediatricDosingWeightCalculatorSchema from './data/calculators/pediatric-dosing-weight-calculator.json';

// Lote 1 Matemáticas & Aritmética Fundamental
import fractionCalculatorSchema from './data/calculators/fraction-calculator.json';
import ratioCalculatorSchema from './data/calculators/ratio-calculator.json';
import rootCalculatorSchema from './data/calculators/root-calculator.json';
import exponentCalculatorSchema from './data/calculators/exponent-calculator.json';
import logCalculatorSchema from './data/calculators/log-calculator.json';

// Lote 2 Teoría de Números y Divisibilidad
import lcmCalculatorSchema from './data/calculators/lcm-calculator.json';
import gcfCalculatorSchema from './data/calculators/gcf-calculator.json';
import factorCalculatorSchema from './data/calculators/factor-calculator.json';
import primeFactorizationCalculatorSchema from './data/calculators/prime-factorization-calculator.json';
import longDivisionCalculatorSchema from './data/calculators/long-division-calculator.json';

// Lote 3 Álgebra, Ecuaciones y Funciones
import quadraticFormulaCalculatorSchema from './data/calculators/quadratic-formula-calculator.json';
import slopeCalculatorSchema from './data/calculators/slope-calculator.json';
import matrixCalculatorSchema from './data/calculators/matrix-calculator.json';
import numberSequenceCalculatorSchema from './data/calculators/number-sequence-calculator.json';
import percentErrorCalculatorSchema from './data/calculators/percent-error-calculator.json';

// Lote 4 Geometría Plana y Trigonometría
import triangleCalculatorSchema from './data/calculators/triangle-calculator.json';
import rightTriangleCalculatorSchema from './data/calculators/right-triangle-calculator.json';
import pythagoreanTheoremCalculatorSchema from './data/calculators/pythagorean-theorem-calculator.json';
import circleCalculatorSchema from './data/calculators/circle-calculator.json';
import distanceCalculatorSchema from './data/calculators/distance-calculator.json';

// Lote 5 Geometría 3D, Áreas, Volúmenes y Cálculo Científico
import areaCalculatorSchema from './data/calculators/area-calculator.json';
import volumeCalculatorSchema from './data/calculators/volume-calculator.json';
import surfaceAreaCalculatorSchema from './data/calculators/surface-area-calculator.json';
import scientificCalculatorSchema from './data/calculators/scientific-calculator.json';
import roundingCalculatorSchema from './data/calculators/rounding-calculator.json';

// Lote 6 Estadística Descriptiva y Promedios
import meanMedianModeRangeCalculatorSchema from './data/calculators/mean-median-mode-range-calculator.json';
import standardDeviationCalculatorSchema from './data/calculators/standard-deviation-calculator.json';
import averageCalculatorSchema from './data/calculators/average-calculator.json';
import zScoreCalculatorSchema from './data/calculators/z-score-calculator.json';
import statisticsCalculatorSchema from './data/calculators/statistics-calculator.json';

// Lote 7 Probabilidad, Combinatoria e Inferencia
import probabilityCalculatorSchema from './data/calculators/probability-calculator.json';
import permutationAndCombinationCalculatorSchema from './data/calculators/permutation-and-combination-calculator.json';
import sampleSizeCalculatorSchema from './data/calculators/sample-size-calculator.json';
import confidenceIntervalCalculatorSchema from './data/calculators/confidence-interval-calculator.json';
import pValueCalculatorSchema from './data/calculators/p-value-calculator.json';

// Lote 8 Sistemas Numéricos y Notación Científica
import binaryCalculatorSchema from './data/calculators/binary-calculator.json';
import hexCalculatorSchema from './data/calculators/hex-calculator.json';
import scientificNotationCalculatorSchema from './data/calculators/scientific-notation-calculator.json';
import bigNumberCalculatorSchema from './data/calculators/big-number-calculator.json';
import randomNumberGeneratorSchema from './data/calculators/random-number-generator.json';

// Lote 9 Física-Química Nuclear, Porcentaje Avanzado y Hub de Matemáticas
import halfLifeCalculatorSchema from './data/calculators/half-life-calculator.json';
import commonFactorCalculatorSchema from './data/calculators/common-factor-calculator.json';
import basicCalculatorSchema from './data/calculators/basic-calculator.json';
import percentageCalculatorAdvancedSchema from './data/calculators/percentage-calculator-advanced.json';
import mathCalculatorsHubSchema from './data/calculators/math-calculators-hub.json';

// Nuevo Lote 1 Tiempo, Fechas y Vida Cotidiana
import ageCalculatorSchema from './data/calculators/age-calculator.json';
import dateCalculatorSchema from './data/calculators/date-calculator.json';
import timeCalculatorSchema from './data/calculators/time-calculator.json';
import hoursCalculatorSchema from './data/calculators/hours-calculator.json';
import timeDurationCalculatorSchema from './data/calculators/time-duration-calculator.json';
import dayCounterSchema from './data/calculators/day-counter.json';

// Nuevo Lote 2 Educación, Estilo de Vida & Entretenimiento
import dayOfTheWeekCalculatorSchema from './data/calculators/day-of-the-week-calculator.json';
import gpaCalculatorSchema from './data/calculators/gpa-calculator.json';
import gradeCalculatorSchema from './data/calculators/grade-calculator.json';
import heightCalculatorSchema from './data/calculators/height-calculator.json';
import braSizeCalculatorSchema from './data/calculators/bra-size-calculator.json';
import loveCalculatorSchema from './data/calculators/love-calculator.json';

// Nuevo Lote 3 Construcción & Vivienda
import concreteCalculatorSchema from './data/calculators/concrete-calculator.json';
import squareFootageCalculatorSchema from './data/calculators/square-footage-calculator.json';
import stairCalculatorSchema from './data/calculators/stair-calculator.json';
import roofingCalculatorSchema from './data/calculators/roofing-calculator.json';
import tileCalculatorSchema from './data/calculators/tile-calculator.json';
import mulchCalculatorSchema from './data/calculators/mulch-calculator.json';

// Nuevo Lote 4 Jardinería, Ingeniería & Utilidades
import gravelCalculatorSchema from './data/calculators/gravel-calculator.json';
import btuCalculatorSchema from './data/calculators/btu-calculator.json';
import electricityCalculatorSchema from './data/calculators/electricity-calculator.json';
import fuelCostCalculatorSchema from './data/calculators/fuel-cost-calculator.json';
import gasMileageCalculatorSchema from './data/calculators/gas-mileage-calculator.json';
import mileageCalculatorSchema from './data/calculators/mileage-calculator.json';

// Nuevo Lote 5 Automotriz & Ingeniería Eléctrica
import horsepowerCalculatorSchema from './data/calculators/horsepower-calculator.json';
import engineHorsepowerCalculatorSchema from './data/calculators/engine-horsepower-calculator.json';
import tireSizeCalculatorSchema from './data/calculators/tire-size-calculator.json';
import voltageDropCalculatorSchema from './data/calculators/voltage-drop-calculator.json';
import ohmsLawCalculatorSchema from './data/calculators/ohms-law-calculator.json';
import resistorCalculatorSchema from './data/calculators/resistor-calculator.json';

// Nuevo Lote 6 Ciencias Físicas & Química
import densityCalculatorSchema from './data/calculators/density-calculator.json';
import massCalculatorSchema from './data/calculators/mass-calculator.json';
import weightCalculatorSchema from './data/calculators/weight-calculator.json';
import speedCalculatorSchema from './data/calculators/speed-calculator.json';
import molarityCalculatorSchema from './data/calculators/molarity-calculator.json';
import molecularWeightCalculatorSchema from './data/calculators/molecular-weight-calculator.json';

// Nuevo Lote 7 Meteorología, Salud & Deportes
import windChillCalculatorSchema from './data/calculators/wind-chill-calculator.json';
import heatIndexCalculatorSchema from './data/calculators/heat-index-calculator.json';
import dewPointCalculatorSchema from './data/calculators/dew-point-calculator.json';
import sleepCycleCalculatorSchema from './data/calculators/sleep-calculator.json';
import golfHandicapCalculatorSchema from './data/calculators/golf-handicap-calculator.json';
import shoeSizeConversionSchema from './data/calculators/shoe-size-conversion.json';

// Nuevo Lote 8 Tecnología, Redes & Seguridad
import ipSubnetCalculatorSchema from './data/calculators/ip-subnet-calculator.json';
import bandwidthCalculatorSchema from './data/calculators/bandwidth-calculator.json';
import passwordGeneratorSchema from './data/calculators/password-generator.json';
import base64EncodeDecodeSchema from './data/calculators/base64-encode-decode.json';
import urlEncodeDecodeSchema from './data/calculators/url-encode-decode.json';
import diceRollerSchema from './data/calculators/dice-roller.json';

// Nuevo Lote 9 Economía, Conversores & Hub Central de Herramientas
import gdpCalculatorSchema from './data/calculators/gdp-calculator.json';
import tipCalculatorSchema from './data/calculators/tip-calculator.json';
import conversionCalculatorSchema from './data/calculators/conversion-calculator.json';
import romanNumeralConverterSchema from './data/calculators/roman-numeral-converter.json';
import timeCardCalculatorSchema from './data/calculators/time-card-calculator.json';
import timeZoneCalculatorSchema from './data/calculators/time-zone-calculator.json';
import otherCalculatorsHubSchema from './data/calculators/other-calculators-hub.json';

// Expansión Física (Bloque 1)
import projectileMotionCalculatorSchema from './data/calculators/projectile-motion-calculator.json';
import kineticEnergyCalculatorSchema from './data/calculators/kinetic-energy-calculator.json';
import potentialEnergyCalculatorSchema from './data/calculators/potential-energy-calculator.json';
import centripetalForceCalculatorSchema from './data/calculators/centripetal-force-calculator.json';
import frictionCalculatorSchema from './data/calculators/friction-calculator.json';
import workEnergyCalculatorSchema from './data/calculators/work-energy-calculator.json';
import freeFallCalculatorSchema from './data/calculators/free-fall-calculator.json';
import pendulumCalculatorSchema from './data/calculators/pendulum-calculator.json';
import snellsLawCalculatorSchema from './data/calculators/snells-law-calculator.json';
import waveSpeedCalculatorSchema from './data/calculators/wave-speed-calculator.json';

// Expansión Química (Bloque 2)
import phCalculatorSchema from './data/calculators/ph-calculator.json';
import idealGasLawCalculatorSchema from './data/calculators/ideal-gas-law-calculator.json';
import solutionDilutionCalculatorSchema from './data/calculators/solution-dilution-calculator.json';
import halfLifeDecayCalculatorSchema from './data/calculators/half-life-calculator.json';
import boylesLawCalculatorSchema from './data/calculators/boyles-law-calculator.json';
import charlesLawCalculatorSchema from './data/calculators/charles-law-calculator.json';
import percentYieldCalculatorSchema from './data/calculators/percent-yield-calculator.json';
import massPercentCalculatorSchema from './data/calculators/mass-percent-calculator.json';
import combustionStoichiometricCalculatorSchema from './data/calculators/combustion-stoichiometric-calculator.json';
import bufferSolutionCalculatorSchema from './data/calculators/buffer-solution-calculator.json';

// Expansión Ingeniería (Bloque 3)
import beamDeflectionCalculatorSchema from './data/calculators/beam-deflection-calculator.json';
import pipeFlowHydraulicCalculatorSchema from './data/calculators/pipe-flow-hydraulic-calculator.json';
import reynoldsNumberCalculatorSchema from './data/calculators/reynolds-number-calculator.json';
import heatTransferConductionCalculatorSchema from './data/calculators/heat-transfer-conduction-calculator.json';
import stressStrainCalculatorSchema from './data/calculators/stress-strain-calculator.json';
import hydraulicCylinderForceCalculatorSchema from './data/calculators/hydraulic-cylinder-force-calculator.json';
import gearRatioSpeedCalculatorSchema from './data/calculators/gear-ratio-speed-calculator.json';
import thermalExpansionLinearCalculatorSchema from './data/calculators/thermal-expansion-linear-calculator.json';
import transformerTurnsRatioCalculatorSchema from './data/calculators/transformer-turns-ratio-calculator.json';
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
import compostCnRatioCalculatorSchema from './data/calculators/compost-c-n-ratio-calculator.json';

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
import pregnancyDueDateCalendarCalculatorSchema from './data/calculators/pregnancy-due-date-calendar-calculator.json';
import dayOfWeekBornCalculatorSchema from './data/calculators/day-of-week-born-calculator.json';
import chronologicalAgeMonthsCalculatorSchema from './data/calculators/chronological-age-months-calculator.json';

// Expansión Educación y Universidad (Bloque 3)
import gpaWeightedCalculatorSchema from './data/calculators/gpa-weighted-calculator.json';
import finalGradeRequiredCalculatorSchema from './data/calculators/final-grade-required-calculator.json';
import gradePercentageLetterConverterSchema from './data/calculators/grade-percentage-letter-converter.json';
import weightedClassGradeCalculatorSchema from './data/calculators/weighted-class-grade-calculator.json';
import highSchoolGpaUnweightedCalculatorSchema from './data/calculators/high-school-gpa-unweighted-calculator.json';
import collegeCreditsCompletionCalculatorSchema from './data/calculators/college-credits-completion-calculator.json';
import testScorePercentageCalculatorSchema from './data/calculators/test-score-percentage-calculator.json';
import gpaScaleConverterCalculatorSchema from './data/calculators/gpa-scale-converter-calculator.json';
import studyTimePerCreditCalculatorSchema from './data/calculators/study-time-per-credit-calculator.json';
import quizWrongAnswersPenaltyCalculatorSchema from './data/calculators/quiz-wrong-answers-penalty-calculator.json';

// Expansión Transporte y Vehículos (Lote Final de 10)
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
  realEstateCalculatorSchema,
  refinanceCalculatorSchema,
  rentalPropertyCalculatorSchema,
  aprCalculatorSchema,
  fhaLoanCalculatorSchema,
  vaMortgageCalculatorSchema,
  homeEquityCalculatorSchema,
  helocCalculatorSchema,
  downPaymentCalculatorSchema,
  rentVsBuyCalculatorSchema,
  autoLeaseCalculatorSchema,
  cashbackVsLowInterestCalculatorSchema,
  simpleInterestCalculatorSchema,
  investmentCalculatorSchema,
  cdCalculatorSchema,
  bondCalculatorSchema,
  mutualFundCalculatorSchema,
  averageReturnCalculatorSchema,
  irrCalculatorSchema,
  paybackPeriodCalculatorSchema,
  presentValueCalculatorSchema,
  futureValueCalculatorSchema,
  savingsCalculatorSchema,
  pensionCalculatorSchema,
  annuityPayoutCalculatorSchema,
  rothIraCalculatorSchema,
  iraCalculatorSchema,
  rmdCalculatorSchema,
  socialSecurityCalculatorSchema,
  fireCalculatorSchema,
  estateTaxCalculatorSchema,
  inflationCalculatorSchema,
  salesTaxCalculatorSchema,
  creditCardPayoffCalculatorSchema,
  personalLoanCalculatorSchema,
  studentLoanCalculatorSchema,
  debtPayoffCalculatorSchema,
  balanceTransferCalculatorSchema,
  breakEvenCalculatorSchema,
  marginCalculatorSchema,
  ebitdaCalculatorSchema,
  dcfCalculatorSchema,
  businessLoanCalculatorSchema,
  commissionCalculatorSchema,
  npvCalculatorSchema,
  workingCapitalCalculatorSchema,
  burnRateCalculatorSchema,
  financialRatiosCalculatorSchema,
  // Lote 1 Salud / Fitness / Nutrición
  calorieCalculatorSchema,
  bodyFatCalculatorSchema,
  bmrCalculatorSchema,
  macroCalculatorSchema,
  idealWeightCalculatorSchema,
  // Lote 2 Salud / Fitness / Nutrición
  pregnancyCalculatorSchema,
  pregnancyWeightGainCalculatorSchema,
  pregnancyConceptionCalculatorSchema,
  dueDateCalculatorSchema,
  paceCalculatorSchema,
  pregnancyUltrasoundCalculatorSchema,
  // Lote 3 Salud / Fitness / Nutrición
  armyBodyFatCalculatorSchema,
  carbohydrateCalculatorSchema,
  leanBodyMassCalculatorSchema,
  healthyWeightCalculatorSchema,
  caloriesBurnedCalculatorSchema,
  // Lote 4 Salud / Fitness / Nutrición
  oneRepMaxCalculatorSchema,
  targetHeartRateCalculatorSchema,
  proteinCalculatorSchema,
  fatIntakeCalculatorSchema,
  tdeeCalculatorSchema,
  // Lote 5 Salud / Fitness / Nutrición
  waterIntakeCalculatorSchema,
  bmiPrimeCalculatorSchema,
  bodyAdiposityIndexCalculatorSchema,
  waistToHeightRatioCalculatorSchema,
  waistToHipRatioCalculatorSchema,
  // Lote 6 Salud / Fitness / Nutrición
  sleepCalculatorSchema,
  pediatricBmiCalculatorSchema,
  targetWeightCalculatorSchema,
  vo2MaxCalculatorSchema,
  runningRacePredictorCalculatorSchema,
  // Lote 7 Salud (Expansión Categoría Health)
  ovulationCalculatorSchema,
  bloodPressureCalculatorSchema,
  bloodSugarConverterCalculatorSchema,
  chronotypeSleepCalculatorSchema,
  childHeightPredictorCalculatorSchema,
  // Lote 8 Fitness (Expansión Categoría Fitness)
  ffmiCalculatorSchema,
  wilksCalculatorSchema,
  creatineDosingCalculatorSchema,
  heartRateRunningZonesCalculatorSchema,
  treadmillInclineCalculatorSchema,
  // Lote 9 Nutrición (Expansión Categoría Food)
  glycemicIndexLoadCalculatorSchema,
  electrolyteIntakeCalculatorSchema,
  ketoCalculatorSchema,
  intermittentFastingCalculatorSchema,
  cookingUnitsConverterCalculatorSchema,
  // Lote 10 Médica / Nefrología (Expansión Health Indicators)
  egfrCkdEpiCalculatorSchema,
  creatinineClearanceCockcroftGaultCalculatorSchema,
  fenaFractionalExcretionSodiumCalculatorSchema,
  anionGapCorrectedCalculatorSchema,
  correctedCalciumAlbuminCalculatorSchema,
  // Lote 11 Médica / Cardiología & Urgencias (Expansión Health Indicators)
  chads2VascScoreCalculatorSchema,
  hasBledScoreCalculatorSchema,
  heartScoreCardiacRiskCalculatorSchema,
  qtcIntervalCalculatorSchema,
  astrupBloodGasInterpreterCalculatorSchema,
  // Lote 12 Urgencias, Hepatología y Neurología Intensiva (Expansión Health Indicators)
  wellsScoreDvtPeCalculatorSchema,
  curb65PneumoniaSeverityCalculatorSchema,
  childPughScoreCalculatorSchema,
  meldScoreCalculatorSchema,
  glasgowComaScaleGcsCalculatorSchema,
  // Lote 13 Sepsis, Pediatría y Fluidoterapia Hospitalaria (Expansión Health Indicators)
  sofaScoreSepsisCalculatorSchema,
  pao2Fio2RatioPafiCalculatorSchema,
  hollidaySegarMaintenanceFluidsCalculatorSchema,
  apgarScoreCalculatorSchema,
  pediatricDosingWeightCalculatorSchema,
  // Lote 1 Matemáticas & Aritmética Fundamental
  fractionCalculatorSchema,
  ratioCalculatorSchema,
  rootCalculatorSchema,
  exponentCalculatorSchema,
  logCalculatorSchema,
  // Lote 2 Teoría de Números y Divisibilidad
  lcmCalculatorSchema,
  gcfCalculatorSchema,
  factorCalculatorSchema,
  primeFactorizationCalculatorSchema,
  longDivisionCalculatorSchema,
  // Lote 3 Álgebra, Ecuaciones y Funciones
  quadraticFormulaCalculatorSchema,
  slopeCalculatorSchema,
  matrixCalculatorSchema,
  numberSequenceCalculatorSchema,
  percentErrorCalculatorSchema,
  // Lote 4 Geometría Plana y Trigonometría
  triangleCalculatorSchema,
  rightTriangleCalculatorSchema,
  pythagoreanTheoremCalculatorSchema,
  circleCalculatorSchema,
  distanceCalculatorSchema,
  // Lote 5 Geometría 3D, Áreas, Volúmenes y Cálculo Científico
  areaCalculatorSchema,
  volumeCalculatorSchema,
  surfaceAreaCalculatorSchema,
  scientificCalculatorSchema,
  roundingCalculatorSchema,
  // Lote 6 Estadística Descriptiva y Promedios
  meanMedianModeRangeCalculatorSchema,
  standardDeviationCalculatorSchema,
  averageCalculatorSchema,
  zScoreCalculatorSchema,
  statisticsCalculatorSchema,
  // Lote 7 Probabilidad, Combinatoria e Inferencia
  probabilityCalculatorSchema,
  permutationAndCombinationCalculatorSchema,
  sampleSizeCalculatorSchema,
  confidenceIntervalCalculatorSchema,
  pValueCalculatorSchema,
  // Lote 8 Sistemas Numéricos y Notación Científica
  binaryCalculatorSchema,
  hexCalculatorSchema,
  scientificNotationCalculatorSchema,
  bigNumberCalculatorSchema,
  randomNumberGeneratorSchema,
  // Lote 9 Física-Química Nuclear, Porcentaje Avanzado y Hub de Matemáticas
  halfLifeCalculatorSchema,
  commonFactorCalculatorSchema,
  basicCalculatorSchema,
  percentageCalculatorAdvancedSchema,
  mathCalculatorsHubSchema,
  // Nuevo Lote 1 Tiempo, Fechas y Vida Cotidiana
  ageCalculatorSchema,
  dateCalculatorSchema,
  timeCalculatorSchema,
  hoursCalculatorSchema,
  timeDurationCalculatorSchema,
  dayCounterSchema,
  // Nuevo Lote 2 Educación, Estilo de Vida & Entretenimiento
  dayOfTheWeekCalculatorSchema,
  gpaCalculatorSchema,
  gradeCalculatorSchema,
  heightCalculatorSchema,
  braSizeCalculatorSchema,
  loveCalculatorSchema,
  // Nuevo Lote 3 Construcción & Vivienda
  concreteCalculatorSchema,
  squareFootageCalculatorSchema,
  stairCalculatorSchema,
  roofingCalculatorSchema,
  tileCalculatorSchema,
  mulchCalculatorSchema,
  // Nuevo Lote 4 Jardinería, Ingeniería & Utilidades
  gravelCalculatorSchema,
  btuCalculatorSchema,
  electricityCalculatorSchema,
  fuelCostCalculatorSchema,
  gasMileageCalculatorSchema,
  mileageCalculatorSchema,
  // Nuevo Lote 5 Automotriz & Ingeniería Eléctrica
  horsepowerCalculatorSchema,
  engineHorsepowerCalculatorSchema,
  tireSizeCalculatorSchema,
  voltageDropCalculatorSchema,
  ohmsLawCalculatorSchema,
  resistorCalculatorSchema,
  // Nuevo Lote 6 Ciencias Físicas & Química
  densityCalculatorSchema,
  massCalculatorSchema,
  weightCalculatorSchema,
  speedCalculatorSchema,
  molarityCalculatorSchema,
  molecularWeightCalculatorSchema,
  // Nuevo Lote 7 Meteorología, Salud & Deportes
  windChillCalculatorSchema,
  heatIndexCalculatorSchema,
  dewPointCalculatorSchema,
  sleepCycleCalculatorSchema,
  golfHandicapCalculatorSchema,
  shoeSizeConversionSchema,
  // Nuevo Lote 8 Tecnología, Redes & Seguridad
  ipSubnetCalculatorSchema,
  bandwidthCalculatorSchema,
  passwordGeneratorSchema,
  base64EncodeDecodeSchema,
  urlEncodeDecodeSchema,
  diceRollerSchema,
  // Nuevo Lote 9 Economía, Conversores & Hub Central de Herramientas
  gdpCalculatorSchema,
  tipCalculatorSchema,
  conversionCalculatorSchema,
  romanNumeralConverterSchema,
  timeCardCalculatorSchema,
  timeZoneCalculatorSchema,
  otherCalculatorsHubSchema,
  // Expansión Física (Bloque 1)
  projectileMotionCalculatorSchema,
  kineticEnergyCalculatorSchema,
  potentialEnergyCalculatorSchema,
  centripetalForceCalculatorSchema,
  frictionCalculatorSchema,
  workEnergyCalculatorSchema,
  freeFallCalculatorSchema,
  pendulumCalculatorSchema,
  snellsLawCalculatorSchema,
  waveSpeedCalculatorSchema,
  // Expansión Química (Bloque 2)
  phCalculatorSchema,
  idealGasLawCalculatorSchema,
  solutionDilutionCalculatorSchema,
  halfLifeDecayCalculatorSchema,
  boylesLawCalculatorSchema,
  charlesLawCalculatorSchema,
  percentYieldCalculatorSchema,
  massPercentCalculatorSchema,
  combustionStoichiometricCalculatorSchema,
  bufferSolutionCalculatorSchema,
  // Expansión Ingeniería (Bloque 3)
  beamDeflectionCalculatorSchema,
  pipeFlowHydraulicCalculatorSchema,
  reynoldsNumberCalculatorSchema,
  heatTransferConductionCalculatorSchema,
  stressStrainCalculatorSchema,
  hydraulicCylinderForceCalculatorSchema,
  gearRatioSpeedCalculatorSchema,
  thermalExpansionLinearCalculatorSchema,
  transformerTurnsRatioCalculatorSchema,
  airDuctSizingCalculatorSchema,
  // Expansión Construcción y Reformas (Bloque 1)
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
  // Expansión Hogar y Vida Cotidiana (Bloque 2)
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
  // Expansión Tecnología y Electrónica (Bloque 3)
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
  // Expansión Conversores (Bloque 1)
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
  // Expansión Fecha y Tiempo (Bloque 2)
  exactAgeCalculatorSchema,
  dateDifferenceDaysCalculatorSchema,
  dateAddSubtractDaysCalculatorSchema,
  businessWorkingDaysCalculatorSchema,
  workHoursTimesheetCalculatorSchema,
  timeDurationAdditionCalculatorSchema,
  timeZoneDifferenceCalculatorSchema,
  pregnancyDueDateCalendarCalculatorSchema,
  dayOfWeekBornCalculatorSchema,
  chronologicalAgeMonthsCalculatorSchema,
  // Expansión Educación y Universidad (Bloque 3)
  gpaWeightedCalculatorSchema,
  finalGradeRequiredCalculatorSchema,
  gradePercentageLetterConverterSchema,
  weightedClassGradeCalculatorSchema,
  highSchoolGpaUnweightedCalculatorSchema,
  collegeCreditsCompletionCalculatorSchema,
  testScorePercentageCalculatorSchema,
  gpaScaleConverterCalculatorSchema,
  studyTimePerCreditCalculatorSchema,
  quizWrongAnswersPenaltyCalculatorSchema,
  // Expansión Transporte y Vehículos (Lote Final de 10)
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

  const t = i18n[lang] || i18n.en;

  // Traducir todas las calculadoras activas automáticamente en el cliente
  const translatedCalculators = useMemo(() => {
    return RAW_CALCULATORS.map((calc) => translateSchema(calc, lang));
  }, [lang]);

  const activeCalculator = useMemo(() => {
    if (!activeCalculatorRaw) return null;
    return translateSchema(activeCalculatorRaw, lang);
  }, [activeCalculatorRaw, lang]);

  // Actualizar document.title y Meta SEO dinámicamente
  useEffect(() => {
    if (viewMode === 'calculator' && activeCalculator) {
      document.title = `${activeCalculator.meta.title} — CalculadoraHub`;
    } else if (viewMode === 'category' && activeCategory) {
      document.title = `${activeCategory.toUpperCase()} Calculators — CalculadoraHub`;
    } else {
      document.title = `CalculadoraHub — Fast & Precise Online Calculators`;
    }
  }, [viewMode, activeCalculator, activeCategory, lang]);

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

  const handleGoHome = () => {
    setViewMode('home');
    setActiveCategory(null);
    setActiveCalculatorRaw(null);
    setSearchQuery('');
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setViewMode('category');
    setActiveCalculatorRaw(null);
  };

  const handleSelectCalculator = (calc) => {
    const original = RAW_CALCULATORS.find((c) => c.meta.id === calc.meta.id) || calc;
    setActiveCalculatorRaw(original);
    setViewMode('calculator');
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
          {viewMode === 'calculator' && activeCalculator ? (
            <div>
              <div style={{ maxWidth: '1200px', margin: '16px auto 0', padding: '0 16px' }}>
                <button onClick={handleGoHome} className="btn-secondary" style={{ height: '32px', fontSize: '0.8125rem' }}>
                  {t.nav.backToCatalog}
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
        <Footer lang={lang} />
      </div>
    </ErrorBoundary>
  );
}
