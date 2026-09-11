/**
 * ServiceDetailPanel Component
 *
 * Displays detailed information about a selected service.
 * Supports both read-only view and edit mode for pipeline data.
 *
 * Features:
 * - View service overview, team, repository
 * - View/edit pipeline status and stages
 * - View/edit commit information
 * - View service dependencies
 * - Toggle edit mode
 */

import { useState, FC } from 'react'
import type { Service } from '../../types'

/**
 * Status text mapping
 */
const STATUS_TEXT: Record<string, string> = {
  green: 'Healthy',
  orange: 'Running',
  red: 'Failed'
}

/**
 * Props for ServiceDetailPanel component
 */
interface ServiceDetailPanelProps {
  service: Service
  dependencies: Service[]
  dependents: Service[]
  onClose: () => void
  onUpdateService: (serviceId: string, updates: Partial<Service>) => void
}

/**
 * ServiceDetailPanel - Detail view of a selected service
 *
 * Displays comprehensive service information and allows editing
 */
const ServiceDetailPanel: FC<ServiceDetailPanelProps> = ({
  service,
  dependencies,
  dependents,
  onClose,
  onUpdateService
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [editData, setEditData] = useState<Partial<Service> | null>(null)

  const statusText = STATUS_TEXT[service.status] || 'Unknown'
  const latestRun = service.pipeline?.latestRun
  const lastCommit = service.pipeline?.lastCommit

  // Initialize edit mode with current data
  const initEditMode = () => {
    setEditData({
      branch: latestRun?.branch || 'main',
      status: latestRun?.status || 'passed',
      commitMessage: lastCommit?.message || '',
      stages: latestRun?.stages
        ? { ...latestRun.stages }
        : {
            build: { status: 'passed', duration: 300 },
            test: { status: 'passed', duration: 600 },
            deploy: { status: 'passed', duration: 300 }
          }
    })
    setIsEditMode(true)
  }

  const cancelEdit = () => {
    setEditData(null)
    setIsEditMode(false)
  }

  const saveEdit = () => {
    const updatedService = {
      ...service,
      pipeline: {
        ...service.pipeline,
        latestRun: {
          ...service.pipeline.latestRun,
          branch: editData.branch,
          status: editData.status,
          stages: editData.stages
        },
        lastCommit: {
          ...service.pipeline.lastCommit,
          message: editData.commitMessage
        }
      },
      // Update service status based on pipeline result
      status:
        editData.status === 'failed'
          ? 'red'
          : editData.status === 'running'
            ? 'orange'
            : 'green',
      lastUpdate: new Date().toISOString()
    }

    onUpdateService(service.id, updatedService)
    setEditData(null)
    setIsEditMode(false)
  }

  return (
    <div className="service-detail-panel">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title">
          <div className="status-badge" data-status={service.status} />
          <h2>{service.name}</h2>
        </div>
        <div className="detail-actions">
          {!isEditMode && (
            <button className="btn-edit" onClick={initEditMode} title="Edit pipeline data">
              ✎ Edit
            </button>
          )}
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Overview Section */}
        <section className="detail-section">
          <h3>Overview</h3>
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className="value">{statusText}</span>
          </div>
          <div className="detail-row">
            <span className="label">Team:</span>
            <span className="value">{service.team}</span>
          </div>
          {service.repository && (
            <div className="detail-row">
              <span className="label">Repository:</span>
              <a href={service.repository} target="_blank" rel="noopener noreferrer">
                {service.repository.split('/').pop()}
              </a>
            </div>
          )}
          {service.description && (
            <div className="detail-row">
              <span className="label">Description:</span>
              <span className="value">{service.description}</span>
            </div>
          )}
        </section>

        {/* Pipeline Section */}
        {latestRun && <PipelineSection isEditMode={isEditMode} editData={editData} setEditData={setEditData} latestRun={latestRun} />}

        {/* Commit Section */}
        {lastCommit && !isEditMode && <CommitSection lastCommit={lastCommit} />}

        {/* Commit Edit Section */}
        {isEditMode && editData && (
          <section className="detail-section">
            <h3>Commit Message</h3>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={editData.commitMessage}
                onChange={(e) => setEditData({ ...editData, commitMessage: e.target.value })}
                rows="3"
              />
            </div>
          </section>
        )}

        {/* Dependencies Section */}
        {(dependencies.length > 0 || dependents.length > 0) && (
          <section className="detail-section">
            <h3>Dependencies</h3>
            {dependencies.length > 0 && (
              <div className="dependency-list">
                <h4>Depends on:</h4>
                {dependencies.map((dep) => (
                  <div key={dep.id} className="dependency-item">
                    <span className="arrow">→</span>
                    <span>{dep.name}</span>
                  </div>
                ))}
              </div>
            )}
            {dependents.length > 0 && (
              <div className="dependency-list">
                <h4>Depended on by:</h4>
                {dependents.map((dependent) => (
                  <div key={dependent.id} className="dependency-item">
                    <span className="arrow">←</span>
                    <span>{dependent.name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Last Updated */}
        <div className="detail-footer">
          <small>Last updated: {new Date(service.lastUpdate).toLocaleString()}</small>
        </div>
      </div>

      {/* Edit Actions */}
      {isEditMode && (
        <div className="edit-actions">
          <button className="btn-save" onClick={saveEdit}>
            Save Changes
          </button>
          <button className="btn-cancel" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * PipelineSection - Read or edit view of pipeline
 */
function PipelineSection({ isEditMode, editData, setEditData, latestRun }) {
  return (
    <section className="detail-section">
      <h3>Latest Pipeline {isEditMode && <span className="edit-badge">Editing</span>}</h3>

      {isEditMode ? (
        <div className="edit-mode">
          <div className="form-group">
            <label>Pipeline Result</label>
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <option value="passed">✓ Passed</option>
              <option value="running">⏳ Running</option>
              <option value="failed">✕ Failed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Branch</label>
            <input
              type="text"
              value={editData.branch}
              onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Stages</label>
            {Object.entries(editData.stages).map(([stageName, stageData]) => (
              <div key={stageName} className="stage-edit">
                <span className="stage-name">{stageName.charAt(0).toUpperCase() + stageName.slice(1)}</span>
                <select
                  value={stageData.status}
                  onChange={(e) => {
                    const updatedStages = { ...editData.stages }
                    updatedStages[stageName].status = e.target.value
                    setEditData({ ...editData, stages: updatedStages })
                  }}
                >
                  <option value="passed">✓ Passed</option>
                  <option value="failed">✕ Failed</option>
                  <option value="running">⏳ Running</option>
                  <option value="skipped">⊘ Skipped</option>
                </select>
                <div className="duration-input">
                  <input
                    type="number"
                    min="0"
                    value={stageData.duration}
                    onChange={(e) => {
                      const updatedStages = { ...editData.stages }
                      updatedStages[stageName].duration = parseInt(e.target.value)
                      setEditData({ ...editData, stages: updatedStages })
                    }}
                  />
                  <span>seconds</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="detail-row">
            <span className="label">Run:</span>
            <span className="value">#{latestRun.number}</span>
          </div>
          <div className="detail-row">
            <span className="label">Branch:</span>
            <span className="value">{latestRun.branch}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className="value">{latestRun.status.charAt(0).toUpperCase() + latestRun.status.slice(1)}</span>
          </div>

          <div className="stages">
            <h4>Stages:</h4>
            {Object.entries(latestRun.stages).map(([stageName, stageData]) => (
              <div key={stageName} className="stage">
                <span className="stage-name">{stageName.charAt(0).toUpperCase() + stageName.slice(1)}</span>
                <span className={`stage-status ${stageData.status}`}>
                  {stageData.status === 'passed' && '✓'}
                  {stageData.status === 'failed' && '✕'}
                  {stageData.status === 'running' && '⏳'}
                  {stageData.status === 'skipped' && '⊘'}
                </span>
                <span className="stage-duration">({Math.round(stageData.duration / 60)}m)</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

/**
 * CommitSection - Display last commit info
 */
function CommitSection({ lastCommit }) {
  return (
    <section className="detail-section">
      <h3>Last Commit</h3>
      <div className="detail-row">
        <span className="label">Hash:</span>
        <span className="value monospace">{lastCommit.hash.substring(0, 8)}</span>
      </div>
      <div className="detail-row">
        <span className="label">Message:</span>
        <span className="value">{lastCommit.message}</span>
      </div>
      <div className="detail-row">
        <span className="label">Author:</span>
        <span className="value">{lastCommit.author}</span>
      </div>
      {lastCommit.url && (
        <div className="detail-row">
          <a href={lastCommit.url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      )}
    </section>
  )
}

export default ServiceDetailPanel
