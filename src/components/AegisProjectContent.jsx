import { useState } from 'react';
import { aegisScoringDimensions, aegisFeatures } from '../data/projectsData';
import simulationGraph from '../assets/Images/Aegis/SimulationGraph.png';
import CandidateDetails from '../assets/Images/Aegis/aegisCandDetails.jpg';
import structuralValidation from '../assets/Images/Aegis/structure.png';
import knowledgeBase from '../assets/Images/Aegis/discovery.png';

const screenshotData = [
  {
    label: 'Simulation Graph',
    hint: 'Real-time candidate evolution across iterations',
    src: simulationGraph,
    alt: 'Aegis simulation graph showing candidate evolution across iterations',
  },
  {
    label: 'Knowledge Base',
    hint: 'Uploaded papers and PubMed discovery',
    src: knowledgeBase,
  },
  {
    label: 'Candidate Detail Panel',
    hint: '7-dimension scores with evidence citations',
    src: CandidateDetails,
  },
  {
    label: 'Structural Validation',
    hint: 'PDB mapping and 3Dmol rendering',
    src: structuralValidation,
  },
];

const ScreenshotModal = ({ open, onClose, label, hint, src, alt }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 transition-all"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-6 sm:p-10 shadow-2xl flex flex-col items-center w-[95vw] max-w-6xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-apple-gray-100 hover:bg-apple-gray-200 border border-apple-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          aria-label="Close enlarged screenshot"
        >
          <svg className="w-6 h-6 text-apple-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="w-full min-h-[50vh] sm:min-h-[62vh] flex items-center justify-center bg-apple-gray-50 border border-apple-gray-200 rounded-xl mb-6 overflow-hidden">
          {src ? (
            <img src={src} alt={alt || label} className="w-full h-full object-contain" />
          ) : (
            <svg className="w-28 h-28 sm:w-32 sm:h-32 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <span className="text-xl sm:text-2xl font-semibold text-apple-gray-800 text-center">{label}</span>
        {hint && <span className="text-base sm:text-lg text-apple-gray-500 text-center mt-2">{hint}</span>}
      </div>
    </div>
  );
};

const AegisProjectContent = () => {
  const [modal, setModal] = useState({ open: false, label: '', hint: '' });

  const openModal = (item) => setModal({ open: true, ...item });
  const closeModal = () => setModal({ open: false, label: '', hint: '', src: null, alt: '' });

  return (
    <>
            {/* Screenshots */}
            <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Screenshots
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {screenshotData.map((item) => (
            <div
              key={item.label}
              className="cursor-zoom-in group hover:scale-[1.03] hover:shadow-lg transition transform duration-200 ease-out"
              onClick={() => openModal(item)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(item);
                }
              }}
              role="button"
              aria-label={`Expand screenshot: ${item.label}`}
            >
              <div className="rounded-xl overflow-hidden border border-apple-gray-200 bg-apple-gray-50 min-h-[220px] sm:min-h-[280px] group-hover:shadow-md transition-all duration-200">
                {item.src ? (
                  <>
                    <img
                      src={item.src}
                      alt={item.alt || item.label}
                      className="w-full h-full min-h-[220px] sm:min-h-[280px] object-cover object-top"
                    />
                    <div className="px-4 py-3 bg-white border-t border-apple-gray-200">
                      <span className="text-sm font-medium text-apple-gray-700">{item.label}</span>
                      <span className="text-xs text-apple-gray-400 ml-2">(Click to expand)</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-8 min-h-[220px] sm:min-h-[280px] group-hover:bg-apple-gray-100 transition-colors duration-200 border border-dashed border-apple-gray-300">
                    <svg className="w-14 h-14 sm:w-16 sm:h-16 text-apple-gray-300 group-hover:text-apple-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base sm:text-lg font-medium text-apple-gray-500 group-hover:text-apple-gray-700 transition-colors text-center">{item.label}</span>
                    {item.hint && <span className="text-sm text-apple-gray-400 text-center">{item.hint}</span>}
                    <span className="text-xs mt-2 text-apple-gray-300 group-hover:text-apple-gray-400 transition-colors">(Click to expand)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScreenshotModal
          open={modal.open}
          onClose={closeModal}
          label={modal.label}
          hint={modal.hint}
          src={modal.src}
          alt={modal.alt}
        />
      </div>

      {/* How It Works
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          How It Works
        </h3>
        <p className="text-apple-gray-600 mb-6">
          Each simulation iteration runs four steps in sequence — RAG retrieval, candidate generation,
          multi-dimensional scoring, and real-time broadcast to the frontend graph.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'RAG Retrieval', desc: 'Embed the current query and retrieve the 15 most semantically relevant paper chunks via cosine similarity.' },
            { step: '02', title: 'Generation', desc: 'Claude proposes 4 new candidates with mechanism, components, rationale, and parent lineage.' },
            { step: '03', title: 'Scoring', desc: 'Each candidate is scored independently across 7 weighted dimensions with evidence citations.' },
            { step: '04', title: 'Broadcast', desc: 'Ranked candidates stream over WebSocket and render as nodes in the live reasoning graph.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-apple-gray-50 rounded-xl p-5 border border-apple-gray-200"
            >
              <span className="text-xs font-bold text-apple-gray-400 uppercase tracking-wider">{item.step}</span>
              <h4 className="text-base font-semibold text-apple-gray-900 mt-2 mb-2">{item.title}</h4>
              <p className="text-sm text-apple-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div> */}

    {/* Benchmark Interpretation */}
    <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Benchmark Interpretation
        </h3>
        <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200">
          <p className="text-sm sm:text-base text-apple-gray-700 leading-relaxed">
            I used the influenza H5N1 (common flu virus) benchmark to test Aegis. Feeding The system was papers strictly focussed on the pathogenisis, structure and virology of the H5N1 virus.
            the goal was to design a universal vaccine candidate that could scale quickly in a pandemic senario stay withinstandart refrigeration ( 35.6 - 46.4°F ). The strongest
            performers cluster around multivalent inactivated and mRNA/LNP strategies, with the top overall score
            reaching 0.80 in iteration 3, while structural benchmarking shows strong alignment with known H5N1
            vaccine/PDB references (mostly compatibility around 8.0-8.5). In short, the system seems to come
            to practical and structurally grounded options rather than purely novel-but-risky designs.
          </p>
        </div>
      </div>

      


      {/* Comparison to Existing Solutions */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Comparison to Existing Solutions
        </h3>
        <div className="bg-apple-gray-50 rounded-2xl border border-apple-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm text-apple-gray-800">
              <thead>
                <tr className="text-left bg-apple-gray-100">
                  <th className="px-4 py-3 font-semibold text-apple-gray-700">Solution Class</th>
                  <th className="px-4 py-3 font-semibold text-apple-gray-700">Current/Tested Baseline</th>
                  <th className="px-4 py-3 font-semibold text-apple-gray-700">Aegis Candidate Trend</th>
                  <th className="px-4 py-3 font-semibold text-apple-gray-700">What This Suggests</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-apple-gray-200 hover:bg-white transition-colors">
                  <td className="px-4 py-3">Multivalent inactivated (BPL)</td>
                  <td className="px-4 py-3">Audenz / Aflunov / Prepandrix-like references in report</td>
                  <td className="px-4 py-3">Top performer (0.80) and multiple top-5 entries</td>
                  <td className="px-4 py-3">Strong fit for safety + manufacturability under pandemic constraints</td>
                </tr>
                <tr className="border-t border-apple-gray-200 hover:bg-white transition-colors">
                  <td className="px-4 py-3">mRNA / LNP platforms</td>
                  <td className="px-4 py-3">Compared against known H5N1 structural templates</td>
                  <td className="px-4 py-3">Consistent high ranking (about 0.73-0.77 range)</td>
                  <td className="px-4 py-3">Competitive when broad protection and speed are prioritized</td>
                </tr>
                <tr className="border-t border-apple-gray-200 hover:bg-white transition-colors">
                  <td className="px-4 py-3">Yeast-display / nanoparticle approaches</td>
                  <td className="px-4 py-3">No dominant licensed baseline, more experimental class</td>
                  <td className="px-4 py-3">Mid-to-high scores with stronger novelty variance</td>
                  <td className="px-4 py-3">Promising innovation paths, but less consistently optimal than top baseline-aligned options</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-sm text-apple-gray-500">
          This is a computational benchmark against structurally matched, previously tested vaccine classes; it is not a substitute for wet-lab or clinical validation.
        </p>
      </div>

      {/* Key Features
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Key Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aegisFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-apple-gray-50 rounded-xl p-5 border border-apple-gray-200 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-apple-gray-300"
            >
              <h4 className="text-base font-semibold text-apple-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-apple-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Scoring Dimensions */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-1">
          Scoring Dimensions
        </h3>
        <p className="text-apple-gray-600 mb-4">
          Every candidate is scored independently across 7 dimensions. Immunogenicity and safety each carry 20% weight.
        </p>
        <div className="w-full overflow-x-auto">
          <div className="bg-apple-gray-50 rounded-2xl border border-apple-gray-200 shadow-sm">
            <table className="min-w-[480px] w-full text-sm text-apple-gray-800">
              <thead>
                <tr className="text-left bg-apple-gray-100">
                  <th className="px-4 py-3 font-semibold text-apple-gray-700">Dimension</th>
                  <th className="px-4 py-3 font-semibold text-apple-gray-700">Weight</th>
                </tr>
              </thead>
              <tbody>
                {aegisScoringDimensions.map((dim) => (
                  <tr
                    key={dim.name}
                    className="border-t border-apple-gray-200 hover:bg-white transition-colors"
                  >
                    <td className="px-4 py-3">{dim.name}</td>
                    <td className="px-4 py-3">{dim.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Anti-Hallucination */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Grounding
        </h3>

        <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200">
        <h4 className="text-sm text-apple-gray-900">In order to prevent hallucinations: </h4>
          <ul className="space-y-2 text-sm text-apple-gray-600 leading-relaxed list-disc list-inside">
          <li>Claude populates strict JSON schemas to prevent free-form text parsing.</li>
                <li>Every score maps back to specific chunks of text in the database.</li>
                <li>Generation and scoring are separate API calls, the scorer never sees the generator's reasoning.</li>
                <li>Scoring anchors (0.2 / 0.5 / 0.9) reduce LLM score compression around the "polite zone".</li>
          </ul>
        </div>
      </div>

      {/* Limitations */}
      <div>
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Known Limitations
        </h3>
        <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200">
          <ul className="space-y-2 text-sm text-apple-gray-600 leading-relaxed list-disc list-inside">
            <li>No wet-lab validation, this accelerates hypothesis generation, not experimental confirmation.</li>
            <li>Cost per simulation: roughly $5–15 in Claude API calls for a 10-iteration run.</li>
            <li>Cold-start: an empty project produces candidates from training data alone, with no evidence grounding.</li>
            <li>Single-server event bus, WebSocket events use an in-memory queue, limiting horizontal scaling.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AegisProjectContent;
