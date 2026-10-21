import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useReport } from '../hooks/useReport';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui/Progress';
import { LoadingState } from '../../../components/feedback/LoadingState';

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="transition-all duration-150 border-border">
      <div
        onClick={() => setOpen((o) => !o)}
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-app-bg/50 select-none"
      >
        <span className="shrink-0 w-6 h-6 rounded-sm bg-primary-soft text-primary text-xs font-bold flex items-center justify-center">
          Q{index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            {item.question}
          </p>
        </div>
        <span className="text-muted shrink-0 pt-0.5">
          <svg
            className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border/60 flex flex-col gap-3 bg-surface">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Assessment Intention
            </span>
            <p className="text-xs text-muted leading-relaxed">
              {item.intention}
            </p>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-border/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Model Answer
            </span>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

const RoadMapDay = ({ day }) => {
  const rawDay = day.day != null ? String(day.day).trim() : '';
  const dayLabel = /^day/i.test(rawDay) ? rawDay : `Day ${rawDay}`;

  return (
    <Card className="border-border">
      <CardHeader className="py-3 px-4 bg-app-bg/40 flex-row items-center justify-between gap-3">
        <Badge variant="primary" size="sm">{dayLabel}</Badge>
        <h3 className="text-xs font-semibold text-foreground flex-1 truncate">{day.focus}</h3>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="flex flex-col gap-2">
          {day.tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const ReportDetail = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const { report, loading, getReportPDFFunc } = useReport();
  const [activeTab, setActiveTab] = useState('technical');

  if (loading || !report) {
    return <LoadingState message="Fetching interview strategy details..." variant="spinner" />;
  }

  const scoreVariant = report.matchScore >= 80 ? 'success' : report.matchScore >= 60 ? 'warning' : 'danger';

  const tabs = [
    { id: 'technical', label: 'Technical Q&A', count: report.technicalQNAs?.length || 0 },
    { id: 'behavioral', label: 'Behavioral Q&A', count: report.behaviouralQNAs?.length || 0 },
    { id: 'roadmap', label: 'Preparation Roadmap', count: `${report.preparationPlan?.length || 0} Days` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={report.title || 'Interview Strategy Plan'}
        subtitle="Custom analysis generated from your profile and target position description."
        backAction={
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            ← Back
          </Button>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            isLoading={loading}
            disabled={loading}
            onClick={() => getReportPDFFunc(interviewId)}
          >
            Download PDF Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (2 cols on desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Navigation Tabs */}
          <div className="flex border-b border-border gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors duration-150 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  <Badge variant={isActive ? 'primary' : 'neutral'} size="sm">
                    {tab.count}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'technical' && (
            <div className="flex flex-col gap-3">
              {report.technicalQNAs?.map((q, i) => (
                <QuestionCard key={i} item={q} index={i} />
              ))}
            </div>
          )}

          {activeTab === 'behavioral' && (
            <div className="flex flex-col gap-3">
              {report.behaviouralQNAs?.map((q, i) => (
                <QuestionCard key={i} item={q} index={i} />
              ))}
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="flex flex-col gap-3">
              {report.preparationPlan?.map((day, i) => (
                <RoadMapDay key={day.day || i} day={day} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Summary (1 col on desktop) */}
        <div className="flex flex-col gap-4">
          {/* Match Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>Role Match Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground">
                  {report.matchScore}<span className="text-base font-normal text-muted">%</span>
                </span>
                <Badge variant={scoreVariant} size="md">
                  {report.matchScore >= 80 ? 'Strong Match' : report.matchScore >= 60 ? 'Moderate Match' : 'Skill Gaps Exist'}
                </Badge>
              </div>

              <Progress
                value={report.matchScore}
                variant={scoreVariant}
                size="md"
              />
              <p className="text-xs text-muted leading-relaxed">
                Score based on required vs. demonstrated technical skills and background.
              </p>
            </CardContent>
          </Card>

          {/* Skill Gap Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {report.skillGap && report.skillGap.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {report.skillGap.map((gap, i) => {
                    const badgeVariant =
                      gap.severity === 'high' ? 'danger' : gap.severity === 'medium' ? 'warning' : 'secondary';
                    return (
                      <Badge key={i} variant={badgeVariant} size="md">
                        {gap.skill} ({gap.severity})
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted">No critical skill gaps identified.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
