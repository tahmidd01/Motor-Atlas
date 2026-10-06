export interface TimelineEntry {
  year: number;
  title: string;
  description: string;
  theme: string;
  carId?: string;
  sourceUrl: string;
}
export const milestones: TimelineEntry[] = [
  {
    year: 1908,
    title: 'Mobility finds its scale.',
    description:
      'The Ford Model T begins production. Its long life becomes closely associated with more accessible personal transport.',
    theme: 'A new world',
    carId: 'ford-model-t',
    sourceUrl: 'https://corporate.ford.com/articles/history/the-model-t.html',
  },
  {
    year: 1913,
    title: 'The moving assembly line.',
    description:
      'Ford introduces a moving assembly line at Highland Park, reshaping the speed and economics of automobile production.',
    theme: 'Manufacturing',
    sourceUrl: 'https://corporate.ford.com/articles/history/moving-assembly-line.html',
  },
  {
    year: 1954,
    title: 'Engineering takes flight.',
    description:
      'The 300 SL brings racing-derived construction and direct fuel injection to a memorable road-going coupe.',
    theme: 'The sports car',
    carId: 'mercedes-300sl-w198',
    sourceUrl: 'https://media.mercedes-benz.com/article/35d4b3c7-87e9-4c0a-a536-7c4964268f72',
  },
  {
    year: 1959,
    title: 'A simple idea saves lives.',
    description:
      'Volvo introduces the three-point safety belt designed by Nils Bohlin. Its basic geometry becomes a cornerstone of occupant restraint.',
    theme: 'Safety',
    sourceUrl: 'https://www.volvocars.com/intl/v/car-safety/a-million-more',
  },
  {
    year: 1966,
    title: 'A new shape for the supercar.',
    description:
      'Lamborghini presents the Miura. A transverse mid-mounted V12 and Bertone bodywork help redefine the exotic road car.',
    theme: 'Design revolution',
    carId: 'lamborghini-miura-p400',
    sourceUrl: 'https://www.lamborghini.com/en-en/history/miura',
  },
  {
    year: 1975,
    title: 'Pressure changes performance.',
    description:
      'The production Porsche 911 Turbo joins the range, making turbocharging a defining part of the 911 story.',
    theme: 'Turbocharging',
    carId: 'porsche-911-930-turbo',
    sourceUrl:
      'https://newsroom.porsche.com/de/pressemappen/50-Jahre-Porsche-Turbo-36122/Die-911-Turbo-Generationen.html',
  },
  {
    year: 1987,
    title: 'Less becomes more.',
    description:
      'Ferrari’s fortieth-anniversary F40 brings lightweight composites and twin-turbo power into a stripped-back supercar.',
    theme: 'Supercar evolution',
    carId: 'ferrari-f40',
    sourceUrl: 'https://www.ferrari.com/en-EN/auto/f40',
  },
  {
    year: 1989,
    title: 'An intelligent kind of traction.',
    description:
      'The R32 Skyline GT-R returns with the RB26DETT engine and electronically controlled all-wheel drive.',
    theme: 'Japanese performance',
    carId: 'nissan-skyline-gtr-r32',
    sourceUrl: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/skyline_gt-r_1989.html',
  },
  {
    year: 1990,
    title: 'The everyday supercar.',
    description:
      'Honda’s original NSX pairs aluminium construction with a mid-mounted VTEC engine and a focus on usability.',
    theme: 'New thinking',
    carId: 'honda-nsx-na1',
    sourceUrl: 'https://global.honda/en/heritage/episodes/1990thensx.html',
  },
  {
    year: 1992,
    title: 'A seat at the centre.',
    description:
      'McLaren’s F1 introduces a three-seat cabin with a central driving position and a carbon-fibre road-car structure.',
    theme: 'Material ambition',
    carId: 'mclaren-f1',
    sourceUrl: 'https://cars.mclaren.com/us-en/legacy/mclaren-f1',
  },
  {
    year: 2013,
    title: 'Two energies. One ambition.',
    description:
      'The Porsche 918 Spyder and Ferrari LaFerrari show how hybrid propulsion can become part of flagship performance engineering.',
    theme: 'Hybrid performance',
    carId: 'porsche-918-spyder',
    sourceUrl: 'https://newsroom.porsche.com/en/press-kits/Porsche-Museum/Porsche-918-Spyder.html',
  },
  {
    year: 2020,
    title: 'A new balance.',
    description:
      'The C8 Corvette reaches production with its engine behind the cabin, marking a major layout change in the model’s history.',
    theme: 'Reinvention',
    carId: 'chevrolet-corvette-c8',
    sourceUrl: 'https://media.chevrolet.com/media/us/en/chevrolet/vehicles/corvette/2020.html',
  },
  {
    year: 2023,
    title: 'Performance finds another language.',
    description:
      'The IONIQ 5 N brings a driver-focused performance program to Hyundai’s electric platform.',
    theme: 'Electric evolution',
    carId: 'hyundai-ioniq5-n',
    sourceUrl: 'https://www.hyundai.com/de/de/modelle/ioniq-5-n/antriebe.html',
  },
];
export interface Technology {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  explanation: string;
  query: string;
  kind: string;
  sourceUrl: string;
}
export const technologies: Technology[] = [
  {
    id: 'inline',
    name: 'The inline engine',
    subtitle: 'One bank. A clear mechanical rhythm.',
    description:
      'Cylinders sit in a single row. Inline-four and inline-six layouts appear across very different types of cars.',
    explanation:
      'An inline-six has inherently balanced primary and secondary forces. Packaging length and mass still matter, and engine layout alone does not determine a car’s character.',
    query: 'Inline',
    kind: 'Combustion layouts',
    sourceUrl: 'https://www.bmw-m.com/en/topics/magazine-article-pool/bmw-m3-e46-portraet.html',
  },
  {
    id: 'v-engine',
    name: 'The V engine',
    subtitle: 'Two banks. Compact length.',
    description:
      'Cylinders are arranged in two banks at an angle, creating the familiar V6, V8, V10, and V12 configurations.',
    explanation:
      'The V arrangement packages many cylinders within a shorter block than a comparable inline layout. Bank angle, crankshaft design, firing order, and intake system all influence its behaviour.',
    query: 'V',
    kind: 'Combustion layouts',
    sourceUrl: 'https://www.ferrari.com/en-EN/auto/f40',
  },
  {
    id: 'flat',
    name: 'The flat engine',
    subtitle: 'A low centre of mechanical mass.',
    description:
      'Opposed cylinder banks lie horizontally. Porsche’s flat-six offers one of the most familiar examples.',
    explanation:
      'A low engine height can support a low centre of gravity. The broad layout brings its own packaging tradeoffs. “Boxer” describes a particular opposed-piston motion; it is not identical to every 180-degree V arrangement.',
    query: 'Flat',
    kind: 'Combustion layouts',
    sourceUrl: 'https://www.porsche.com/stories/innovation/what-is-a-boxer-engine/',
  },
  {
    id: 'rotary',
    name: 'The rotary engine',
    subtitle: 'A different route around the same problem.',
    description:
      'Rotors turn within shaped housings instead of pistons moving up and down inside cylinders.',
    explanation:
      'The Wankel rotary can be compact and smooth at high engine speeds. Combustion chamber shape, sealing, and emissions introduce distinct engineering challenges. Its displacement should not be compared directly with piston-engine displacement.',
    query: 'Rotary',
    kind: 'Combustion layouts',
    sourceUrl: 'https://www.mazda.com/ja/about/history/greatcar/rx-7/03/',
  },
  {
    id: 'naturally-aspirated',
    name: 'Naturally aspirated',
    subtitle: 'Atmospheric pressure. Unassisted.',
    description:
      'Air enters the engine without a turbocharger or supercharger increasing intake pressure.',
    explanation:
      'Engine capacity, air-flow design, valve timing, and rpm shape its output. Naturally aspirated engines often offer a direct relationship between throttle input and response, but the complete system determines the experience.',
    query: 'Naturally aspirated',
    kind: 'Air & energy',
    sourceUrl:
      'https://newsroom.porsche.com/de/2022/produkte/porsche-911-gt3-rs-weltpremiere-29178.html',
  },
  {
    id: 'turbo',
    name: 'Turbocharging',
    subtitle: 'Exhaust energy, put back to work.',
    description:
      'An exhaust-driven turbine powers a compressor, increasing the mass of air available to the engine.',
    explanation:
      'More air allows more fuel to be burned. Intercooling, boost control, and turbine sizing shape response, heat, and power. Turbo lag describes the delay between demand and pressure building under certain conditions.',
    query: 'Turbo',
    kind: 'Air & energy',
    sourceUrl:
      'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/280_skyline_gt-r_v-spec_ii.html',
  },
  {
    id: 'supercharged',
    name: 'Supercharging',
    subtitle: 'A compressor with a direct connection.',
    description:
      'A supercharger raises intake pressure using mechanical drive or, in some systems, electric power.',
    explanation:
      'A mechanically driven compressor follows engine operation closely but consumes some of the engine’s output. Supercharging offers a different set of response and efficiency tradeoffs from an exhaust-driven turbocharger.',
    query: 'Supercharged',
    kind: 'Air & energy',
    sourceUrl: 'https://www.lotuscars.com/en-GB/emira',
  },
  {
    id: 'hybrid',
    name: 'Hybrid propulsion',
    subtitle: 'Two sources of energy. One system.',
    description:
      'Combustion and electric propulsion share the task, with strategies that vary considerably between vehicles.',
    explanation:
      'Energy recovery and electric assistance can improve efficiency or support performance. A plug-in hybrid can recharge from an external source; a non-plug-in hybrid normally replenishes its battery through the engine and recovered energy.',
    query: 'Hybrid',
    kind: 'New powertrains',
    sourceUrl: 'https://newsroom.porsche.com/en/press-kits/Porsche-Museum/Porsche-918-Spyder.html',
  },
  {
    id: 'electric',
    name: 'Battery electric',
    subtitle: 'Stored energy. Immediate response.',
    description:
      'Electric motors turn battery energy into propulsion without an onboard combustion engine.',
    explanation:
      'Battery capacity is energy, measured in kWh. Motor output and charging rate are power, measured in kW. Range depends on the test cycle, temperature, speed, and driving conditions. Peak charging power is not a constant charging rate.',
    query: 'Electric',
    kind: 'New powertrains',
    sourceUrl: 'https://www.hyundai.com/de/de/modelle/ioniq-5-n/antriebe.html',
  },
  {
    id: 'hydrogen',
    name: 'Hydrogen fuel cells',
    subtitle: 'Electric propulsion from a different store.',
    description:
      'A fuel cell combines hydrogen and oxygen to generate electricity for an electric drivetrain.',
    explanation:
      'Hydrogen is stored onboard, typically under high pressure. Fuel-cell vehicles are electrically driven. Their overall environmental impact depends on hydrogen production, distribution, and use. No hydrogen vehicle is currently indexed in this archive.',
    query: 'Hydrogen',
    kind: 'New powertrains',
    sourceUrl: 'https://global.toyota/en/newsroom/toyota/22740159.html',
  },
  {
    id: 'aerodynamics',
    name: 'Aerodynamics',
    subtitle: 'An invisible engineering surface.',
    description:
      'Airflow shapes drag, downforce, cooling, and stability. Those aims often compete with one another.',
    explanation:
      'Downforce increases tyre loading at speed, while drag resists motion. Active elements let engineers adjust the compromise for different situations. The 992 GT3 RS makes this visible through its active wing.',
    query: 'Track',
    kind: 'Beyond propulsion',
    sourceUrl:
      'https://newsroom.porsche.com/de/2022/produkte/porsche-911-gt3-rs-weltpremiere-29178.html',
  },
  {
    id: 'materials',
    name: 'Advanced materials',
    subtitle: 'Strength where it matters. Less mass everywhere else.',
    description:
      'Aluminium, carbon-fibre composites, and high-strength steels give engineers different ways to shape a structure.',
    explanation:
      'Material choice is a balance of stiffness, weight, repairability, cost, and manufacturing process. Carbon fibre is especially effective when engineers can orient its fibres to suit the loads.',
    query: 'McLaren',
    kind: 'Beyond propulsion',
    sourceUrl: 'https://cars.mclaren.com/us-en/legacy/mclaren-f1',
  },
  {
    id: 'autonomy',
    name: 'Driver assistance & autonomy',
    subtitle: 'Sensing, deciding, and acting.',
    description:
      'Cameras, radar, software, and other sensors can support particular driving tasks within defined operating conditions.',
    explanation:
      'Driver assistance is not the same as unrestricted autonomous driving. A system’s required supervision and operating domain matter more than its marketing name. This archive does not infer automation capability from a vehicle’s powertrain.',
    query: '',
    kind: 'Beyond propulsion',
    sourceUrl: 'https://www.nhtsa.gov/vehicle-safety/automated-vehicles-safety',
  },
];
export const glossary: [string, string][] = [
  [
    '4WD',
    'Four-wheel drive. Often associated with systems that provide a selectable low-range transfer case for off-road use; terminology varies by manufacturer.',
  ],
  [
    'AWD',
    'All-wheel drive. Propulsion can be sent to both front and rear axles. The mechanical or electric system and its control strategy vary.',
  ],
  [
    'CVT',
    'Continuously variable transmission. Changes its effective gear ratio through a continuous range rather than fixed steps.',
  ],
  [
    'DC fast charging',
    'Direct-current charging sends power to an EV battery through offboard equipment. Actual power depends on the vehicle, charger, battery temperature, and state of charge.',
  ],
  [
    'DCT',
    'Dual-clutch transmission. Separate clutches handle alternate sets of gears, allowing the next ratio to be prepared before a shift.',
  ],
  [
    'Differential',
    'Allows driven wheels to rotate at different speeds, particularly when turning. Its design also affects how torque is distributed.',
  ],
  [
    'DOHC',
    'Double overhead camshaft. Two camshafts per cylinder bank typically separate intake and exhaust valve control.',
  ],
  [
    'Downforce',
    'An aerodynamic force directed downward. It can increase tyre loading as speed rises, usually with some drag cost.',
  ],
  [
    'Drag coefficient',
    'A dimensionless measure of aerodynamic drag for a specified shape. Frontal area and speed also determine the total drag force.',
  ],
  ['FWD', 'Front-wheel drive. The front wheels supply propulsion as well as steering.'],
  [
    'Horsepower',
    'A unit of power. This archive uses mechanical horsepower, converted from kW. Metric horsepower, commonly labelled PS or CV, is a slightly different unit.',
  ],
  [
    'kWh',
    'Kilowatt-hour. A unit of energy, commonly used to describe battery capacity. It is different from kW, a unit of power.',
  ],
  [
    'LSD',
    'Limited-slip differential. Restricts the difference in driven-wheel speeds to improve traction in particular conditions.',
  ],
  [
    'Regenerative braking',
    'A motor works as a generator during deceleration, converting some kinetic energy into stored electrical energy.',
  ],
  [
    'RPM',
    'Revolutions per minute. Describes the rotational speed of an engine, motor, or other rotating component.',
  ],
  ['RWD', 'Rear-wheel drive. Propulsion reaches the rear wheels, while the front wheels steer.'],
  ['SOHC', 'Single overhead camshaft. One camshaft per cylinder bank controls the valve system.'],
  [
    'Supercharger',
    'A compressor that increases intake pressure, usually driven mechanically by the engine.',
  ],
  [
    'Torque',
    'A turning moment, measured here in newton-metres (Nm). Power depends on both torque and rotational speed.',
  ],
  ['Turbo', 'Short for turbocharger. An exhaust-driven turbine powers an intake compressor.'],
  [
    'VVT',
    'Variable valve timing. Adjusts valve timing to support efficiency, response, or output across different engine speeds and loads.',
  ],
  [
    'Wheelbase',
    'The distance between front and rear axle centres. It affects packaging and contributes to a vehicle’s handling characteristics.',
  ],
];
