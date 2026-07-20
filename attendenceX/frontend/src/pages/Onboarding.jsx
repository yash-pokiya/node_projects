import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import * as onboardingApi from '../api/onboardingApi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  Percent, 
  Calendar, 
  Sparkles,
  Award,
  BookOpen,
  Plus,
  Minus
} from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUserInStore = useAuthStore((state) => state.updateUserInStore);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Screen 1: Cumulative Total Lectures
  const [startingTotal, setStartingTotal] = useState(0);

  // Screen 2: Attended Lectures
  const [startingAttended, setStartingAttended] = useState(0);

  // Screen 3: Minimum target percentage
  const [minPercent, setMinPercent] = useState(75);

  // Screen 4: Average daily lectures
  const [averageDaily, setAverageDaily] = useState(4);

  // Screen 5: Optional weekly pattern
  const [mon, setMon] = useState(4);
  const [tue, setTue] = useState(4);
  const [wed, setWed] = useState(4);
  const [thu, setThu] = useState(4);
  const [fri, setFri] = useState(4);
  const [sat, setSat] = useState(0);
  const [sun, setSun] = useState(0);

  const handleCompleteOnboarding = async (useAveragesOnly = false) => {
    setLoading(true);
    setError('');

    try {
      const pattern = useAveragesOnly 
        ? [averageDaily, averageDaily, averageDaily, averageDaily, averageDaily, 0, 0]
        : [mon, tue, wed, thu, fri, sat, sun];

      const response = await onboardingApi.submitOnboarding({
        startingTotalLectures: startingTotal,
        startingAttendedLectures: startingAttended,
        minimumAttendancePercent: minPercent,
        averageLecturesPerDay: averageDaily,
        weeklyPattern: pattern
      });

      const updatedUser = response.data.data.user;
      updateUserInStore(updatedUser);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (startingTotal < 0) {
        setError('Total lectures must be a positive number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (startingAttended < 0) {
        setError('Attended lectures must be a positive number.');
        return;
      }
      if (startingAttended > startingTotal) {
        setError('Attended lectures cannot exceed total lectures.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (minPercent < 0 || minPercent > 100) {
        setError('Target compliance percent must be between 0 and 100.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (averageDaily < 1 || averageDaily > 15) {
        setError('Average daily capacity must be between 1 and 15.');
        return;
      }
      // Sync Screen 5 default options with averageDaily
      setMon(averageDaily);
      setTue(averageDaily);
      setWed(averageDaily);
      setThu(averageDaily);
      setFri(averageDaily);
      setStep(5);
    } else if (step === 5) {
      handleCompleteOnboarding(false);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercent = Math.min((step / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background glow animations */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl glass-panel bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between min-h-[480px] relative overflow-hidden animate-fade-in">
        
        {/* Step Indicator Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted mb-2 select-none">
            <span>Calculator Setup {step} of 5</span>
            <span className="text-primary">{Math.round(progressPercent)}% Compiled</span>
          </div>
          <div className="w-full h-1 bg-border/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary" 
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 mt-4 rounded-xl bg-danger-bg border border-danger/25 text-danger text-xs font-semibold animate-shake">
            {error}
          </div>
        )}

        {/* Wizard Forms Body */}
        <div className="flex-1 my-6 flex items-center">
          <AnimatePresence mode="wait" className="w-full">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 w-full"
            >
              
              {/* Screen 1: Total Lectures held so far */}
              {step === 1 && (
                <div className="space-y-5 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Step 1: Semester capacity
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Total Lectures Held
                    </h2>
                    <p className="text-xs text-muted font-semibold max-w-sm mx-auto leading-relaxed">
                      Check your college portal and enter the total number of lectures conducted in this semester so far.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <input 
                      type="number"
                      min="0"
                      className="w-36 text-center text-3xl font-black bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary-hover text-foreground py-1 mx-auto"
                      value={startingTotal}
                      onChange={(e) => setStartingTotal(Math.max(0, Number(e.target.value)))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      className="w-full accent-primary bg-hover h-2 rounded-lg cursor-pointer"
                      value={startingTotal}
                      onChange={(e) => setStartingTotal(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Screen 2: Attended Lectures so far */}
              {step === 2 && (
                <div className="space-y-5 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Step 2: Attended tally
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Attended Lectures
                    </h2>
                    <p className="text-xs text-muted font-semibold max-w-sm mx-auto leading-relaxed">
                      Out of the {startingTotal} lectures held, how many classes did you successfully attend?
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <input 
                      type="number"
                      min="0"
                      max={startingTotal}
                      className="w-36 text-center text-3xl font-black bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary-hover text-foreground py-1 mx-auto"
                      value={startingAttended}
                      onChange={(e) => setStartingAttended(Math.min(startingTotal, Math.max(0, Number(e.target.value))))}
                    />
                    <input
                      type="range"
                      min="0"
                      max={startingTotal || 1}
                      className="w-full accent-primary bg-hover h-2 rounded-lg cursor-pointer"
                      value={startingAttended}
                      onChange={(e) => setStartingAttended(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Screen 3: Minimum Target Compliance Percentage */}
              {step === 3 && (
                <div className="space-y-5 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                      <Percent className="w-3.5 h-3.5" /> Step 3: Target Percent
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Minimum Attendance Target
                    </h2>
                    <p className="text-xs text-muted font-semibold max-w-sm mx-auto leading-relaxed">
                      What is the compliance percentage required by your college portal?
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-6 pt-3 select-none">
                    <button
                      type="button"
                      onClick={() => setMinPercent(Math.max(0, minPercent - 5))}
                      className="w-12 h-12 rounded-full border border-border bg-hover flex items-center justify-center text-foreground hover:bg-border transition-all cursor-pointer"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-5xl font-black text-foreground">{minPercent}%</span>
                    <button
                      type="button"
                      onClick={() => setMinPercent(Math.min(100, minPercent + 5))}
                      className="w-12 h-12 rounded-full border border-border bg-hover flex items-center justify-center text-foreground hover:bg-border transition-all cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Screen 4: Average daily lectures */}
              {step === 4 && (
                <div className="space-y-5 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Step 4: Daily capacity
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Average Lectures Per Day
                    </h2>
                    <p className="text-xs text-muted font-semibold max-w-sm mx-auto leading-relaxed">
                      On average, how many lectures or labs are scheduled on a normal working day?
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-3 flex-wrap max-w-md mx-auto select-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAverageDaily(num)}
                        className={`w-12 h-12 rounded-2xl border text-sm font-black transition-all cursor-pointer ${
                          averageDaily === num
                            ? 'bg-primary text-background border-primary shadow'
                            : 'border-border bg-hover text-muted hover:text-foreground'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Screen 5: Optional weekly pattern */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Step 5: Optional Week Grid
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Weekly Schedule Pattern
                    </h2>
                    <p className="text-xs text-muted font-semibold max-w-sm mx-auto leading-relaxed">
                      Adjust specific held lectures per day to calculate forecasts accurately.
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-2 select-none">
                    {[
                      { label: 'Mon', val: mon, set: setMon },
                      { label: 'Tue', val: tue, set: setTue },
                      { label: 'Wed', val: wed, set: setWed },
                      { label: 'Thu', val: thu, set: setThu },
                      { label: 'Fri', val: fri, set: setFri },
                    ].map((day) => (
                      <div key={day.label} className="space-y-1 text-center">
                        <span className="text-[9px] font-bold text-muted block uppercase">{day.label}</span>
                        <input 
                          type="number" 
                          min="0"
                          max="12"
                          className="w-full glass-input text-center text-xs p-1 font-bold"
                          value={day.val}
                          onChange={(e) => day.set(Math.max(0, Number(e.target.value)))}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleCompleteOnboarding(true)}
                      className="w-full py-2 bg-hover hover:bg-hover/80 text-muted hover:text-foreground text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-border"
                    >
                      Skip: Use Average daily load for all days
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex items-center gap-1 text-xs font-bold text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-1.5 bg-primary text-background px-5 py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 5 ? (
              'Complete Setup'
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
