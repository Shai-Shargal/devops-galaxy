/**
 * Add Service Modal
 *
 * Allows users to create new mock services to experiment with.
 * Services are added to the galaxy immediately and can be edited.
 *
 * Level 1 (Mock):
 * - Create service name, team, status
 * - Service appears in galaxy with mock pipeline data
 *
 * Level 2 (Backend):
 * - Will validate against real integrations
 * - Will save to database
 */

import React, { useState } from 'react'
import './AddServiceModal.css'

export default function AddServiceModal({ isOpen, onClose, onAddService }) {
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    status: 'green'
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    }
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Service name must be at least 2 characters'
    }
    if (formData.name.trim().length > 50) {
      newErrors.name = 'Service name must be less than 50 characters'
    }

    if (!formData.team.trim()) {
      newErrors.team = 'Team name is required'
    }
    if (formData.team.trim().length < 2) {
      newErrors.team = 'Team name must be at least 2 characters'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Call parent callback with form data
    onAddService({
      name: formData.name.trim(),
      team: formData.team.trim(),
      status: formData.status
    })

    // Reset form and close
    setFormData({ name: '', team: '', status: 'green' })
    setErrors({})
    onClose()
  }

  const handleCancel = () => {
    setFormData({ name: '', team: '', status: 'green' })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleCancel} />

      {/* Modal */}
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Service</h2>
          <button className="modal-close" onClick={handleCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Service Name */}
          <div className="form-group">
            <label htmlFor="name">Service Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., user-service, recommendation-service"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Team Name */}
          <div className="form-group">
            <label htmlFor="team">Team Name *</label>
            <input
              type="text"
              id="team"
              name="team"
              placeholder="e.g., Backend Team, ML Team"
              value={formData.team}
              onChange={handleChange}
              className={errors.team ? 'error' : ''}
            />
            {errors.team && <span className="error-message">{errors.team}</span>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">Initial Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="green">✓ Healthy (All passed)</option>
              <option value="orange">⏳ Running (Tests in progress)</option>
              <option value="red">✕ Failed (Tests failed)</option>
            </select>
            <small>You can change the status and edit pipeline data after creation</small>
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Service
            </button>
          </div>
        </form>

        <div className="modal-info">
          <p>✨ New services appear in the galaxy immediately with mock pipeline data.</p>
          <p>Click the service to edit its pipeline details and dependencies.</p>
        </div>
      </div>
    </>
  )
}
