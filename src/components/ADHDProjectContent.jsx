import { useState, useRef } from 'react';
import pipelineImage from '../assets/Images/Adhd/pipeline.png';
import adhdReport from '../assets/documents/Adhd_report.pdf';
import { adhdResults } from '../data/projectsData';

const fmt = (x) => (typeof x === "number" ? x.toFixed(2) : x);

const ADHDProjectContent = () => {
  // Inference state
  const [inferenceFile, setInferenceFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Inference handler - ready for backend integration
  const handleInference = async () => {
    if (!inferenceFile) {
      setError('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPrediction(null);

    try {
      // TODO: Replace with your actual backend API endpoint
      const API_ENDPOINT = '/api/predict'; // or 'https://your-backend.railway.app/predict'
      
      const formData = new FormData();
      formData.append('eeg_data', inferenceFile);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Expected response format:
      // {
      //   prediction: 'ADHD' | 'Non-ADHD',
      //   confidence: 0.0-1.0,
      //   probabilities: { 'ADHD': 0.81, 'Non-ADHD': 0.19 },
      //   processing_time: 0.33
      // }
      
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Failed to process EEG data. Please try again.');
      console.error('Inference error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInferenceFile(file);
      setError(null);
      setPrediction(null);
    }
  };

  const handleReset = () => {
    setInferenceFile(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Pipeline Image */}
      <div className="mb-6 rounded-xl overflow-hidden border border-apple-gray-200 bg-apple-gray-50">
        <img
          src={pipelineImage}
          alt="ADHD Classification Pipeline"
          className="w-full h-full"
        />
      </div>

      {/* Results Section */}
      <h3 className="text-2xl font-semibold text-apple-gray-900 mb-1">
        Results
      </h3>
      <div>
        <p className="text-apple-gray-600 mb-4">
          The best results came from the transformer-Teacher, EEGNet-Student pipeline with an accuracy of 81%.
        </p>
      </div>
      <div className="w-full overflow-x-auto mb-8">
        <div className="bg-apple-gray-50 rounded-2xl border border-apple-gray-200 shadow-sm">
          <table className="min-w-[720px] w-full text-sm text-apple-gray-800">
            <thead>
              <tr className="text-left bg-apple-gray-100">
                <th className="px-4 py-3 font-semibold text-apple-gray-700">Model</th>
                <th className="px-4 py-3 font-semibold text-apple-gray-700">Dataset</th>
                <th className="px-4 py-3 font-semibold text-apple-gray-700">Accuracy</th>
                <th className="px-4 py-3 font-semibold text-apple-gray-700">F1</th>
                <th className="px-4 py-3 font-semibold text-apple-gray-700">Precision</th>
                <th className="px-4 py-3 font-semibold text-apple-gray-700">Recall</th>
                <th className="px-4 py-3 font-semibold text-apple-gray-700">Inference</th>
              </tr>
            </thead>
            <tbody>
              {adhdResults.map((r, index) => (
                <tr
                  key={r.model ? `${r.model}-${r.dataset}` : `empty-${index}`}
                  className="border-t border-apple-gray-200 hover:bg-white transition-colors"
                >
                  <td className="px-4 py-3">{r.model || ''}</td>
                  <td className="px-4 py-3">{r.dataset || ''}</td>
                  <td className="px-4 py-3">{r.accuracy !== undefined ? fmt(r.accuracy) : ''}</td>
                  <td className="px-4 py-3">{r.f1 !== undefined ? fmt(r.f1) : ''}</td>
                  <td className="px-4 py-3">{r.precision !== undefined ? fmt(r.precision) : ''}</td>
                  <td className="px-4 py-3">{r.recall !== undefined ? fmt(r.recall) : ''}</td>
                  <td className="px-4 py-3">{r.inference || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test it out Section */}
      <div>
        <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
          Test it out
        </h3>
        
        {/* Instructions */}
        <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200 mb-6">
          <p className="text-apple-gray-600 mb-4">
            Upload your preprocessed EEG feature vectors to get a prediction using the transformer-EEGNet pipeline.
          </p>
          <p className="text-apple-gray-600 text-sm">
            <b>Note:</b> For most accurate results, your dataset should be preprocessed in the same way as the training dataset. 
            <a 
              href="https://www.kaggle.com/datasets/danizo/eeg-dataset-for-adhd" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-apple-gray-900 font-semibold underline hover:text-apple-gray-700 transition-colors ml-1"
            >
              [Dataset reference]
            </a>
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-2xl p-6 border border-apple-gray-200 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-apple-gray-700 mb-2">
              Upload EEG Data File
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.npy,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="eeg-file-input"
                disabled={isProcessing}
              />
              <label
                htmlFor="eeg-file-input"
                className={`
                  flex-1 cursor-pointer
                  px-6 py-4
                  border-2 border-dashed
                  rounded-xl
                  text-center
                  transition-all
                  duration-200
                  ${inferenceFile 
                    ? 'border-apple-gray-300 bg-apple-gray-50' 
                    : 'border-apple-gray-200 bg-apple-gray-50 hover:border-apple-gray-300 hover:bg-white'
                  }
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {inferenceFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-apple-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-apple-gray-700 font-medium">{inferenceFile.name}</span>
                    <span className="text-apple-gray-500 text-sm">
                      ({(inferenceFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-apple-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-apple-gray-500 text-xs">
                      CSV, NPY, JSON, or TXT files
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleInference}
              disabled={!inferenceFile || isProcessing}
              className={`
                flex-1
                px-6 py-3
                rounded-xl
                font-semibold
                transition-all
                duration-200
                ${inferenceFile && !isProcessing
                  ? 'bg-apple-gray-900 text-white hover:bg-apple-gray-800 hover:shadow-lg'
                  : 'bg-apple-gray-200 text-apple-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Get Prediction'
              )}
            </button>
            {inferenceFile && (
              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="
                  px-6 py-3
                  rounded-xl
                  border
                  border-apple-gray-200
                  bg-white
                  text-apple-gray-700
                  font-semibold
                  hover:bg-apple-gray-50
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {prediction && (
          <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200">
            <h4 className="text-xl font-semibold text-apple-gray-900 mb-4">
              Prediction Results
            </h4>
            
            <div className="space-y-4">
              {/* Main Prediction */}
              <div className="bg-white rounded-xl p-6 border border-apple-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-apple-gray-600 font-medium">Classification:</span>
                  <span className={`
                    text-lg font-bold
                    ${prediction.prediction === 'ADHD' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                    }
                  `}>
                    {prediction.prediction || 'Non-ADHD'}
                  </span>
                </div>
                {prediction.confidence !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-apple-gray-600">Confidence:</span>
                      <span className="text-sm font-semibold text-apple-gray-900">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-apple-gray-200 rounded-full h-2">
                      <div
                        className={`
                          h-2 rounded-full transition-all duration-500
                          ${prediction.prediction === 'ADHD' 
                            ? 'bg-red-500' 
                            : 'bg-green-500'
                          }
                        `}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Probability Breakdown */}
              {prediction.probabilities && (
                <div className="bg-white rounded-xl p-6 border border-apple-gray-200">
                  <h5 className="text-sm font-semibold text-apple-gray-700 mb-3">
                    Probability Distribution
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(prediction.probabilities).map(([label, prob]) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-sm text-apple-gray-600 w-24">
                          {label}:
                        </span>
                        <div className="flex-1 bg-apple-gray-200 rounded-full h-2">
                          <div
                            className="bg-apple-gray-900 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-apple-gray-900 w-12 text-right">
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Time */}
              {prediction.processing_time !== undefined && (
                <div className="text-sm text-apple-gray-500 text-center">
                  Processed in {prediction.processing_time.toFixed(3)}s
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ADHDProjectContent;

