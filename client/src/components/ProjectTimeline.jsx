import React from 'react';
import { Clock, PlayCircle, UploadCloud, RotateCcw, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 'Pending', label: 'Pending', icon: Clock, desc: 'Brief accepted, awaiting kickoff' },
  { id: 'In Progress', label: 'In Progress', icon: PlayCircle, desc: 'Creator actively rendering assets' },
  { id: 'Submitted', label: 'Submitted', icon: UploadCloud, desc: 'Deliverables ready for brand review' },
  { id: 'Revision Requested', label: 'Revision', icon: RotateCcw, desc: 'Targeted prompt/lighting adjustments' },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2, desc: 'Master approved & payment released' },
];

const ProjectTimeline = ({ currentStage }) => {
  const getStageIndex = (stage) => {
    const idx = STAGES.findIndex(s => s.id === stage);
    return idx === -1 ? 1 : idx;
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="w-full py-4">
      {/* Step Indicators */}
      <div className="relative flex items-center justify-between">
        {/* Connecting track line */}
        <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-800 z-0">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
          />
        </div>

        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 scale-110 shadow-lg shadow-brand-500/30'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-300 dark:border-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`mt-2 text-xs font-semibold text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-brand-600 dark:text-brand-400'
                    : isPassed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {stage.label}
              </span>

              <span className="hidden sm:inline-block text-[10px] text-gray-400 text-center max-w-[90px] truncate">
                {stage.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;
