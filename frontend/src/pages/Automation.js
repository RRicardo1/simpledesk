import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  CogIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  PencilIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const Automation = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    triggerConditions: {
      event: 'ticket_created',
      conditions: []
    },
    actions: [],
    isActive: true
  });

  // Fetch automation rules
  const { data: rules, isLoading, error, refetch } = useQuery(
    'automation-rules',
    async () => {
      const response = await axios.get('/automation/rules');
      return response.data.rules || [];
    },
    {
      refetchOnWindowFocus: false
    }
  );

  // Create rule mutation
  const createRuleMutation = useMutation(
    async (ruleData) => {
      const response = await axios.post('/automation/rules', ruleData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('automation-rules');
        setShowCreateModal(false);
        resetForm();
      }
    }
  );

  // Update rule mutation
  const updateRuleMutation = useMutation(
    async ({ ruleId, ...ruleData }) => {
      const response = await axios.put(`/automation/rules/${ruleId}`, ruleData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('automation-rules');
        setEditingRule(null);
        resetForm();
      }
    }
  );

  // Delete rule mutation
  const deleteRuleMutation = useMutation(
    async (ruleId) => {
      await axios.delete(`/automation/rules/${ruleId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('automation-rules');
      }
    }
  );

  // Toggle rule active status
  const toggleRuleMutation = useMutation(
    async ({ ruleId, isActive }) => {
      const response = await axios.put(`/automation/rules/${ruleId}`, { isActive });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('automation-rules');
      }
    }
  );

  const resetForm = () => {
    setNewRule({
      name: '',
      description: '',
      triggerConditions: {
        event: 'ticket_created',
        conditions: []
      },
      actions: [],
      isActive: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRule) {
      updateRuleMutation.mutate({ ruleId: editingRule.id, ...newRule });
    } else {
      createRuleMutation.mutate(newRule);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      description: rule.description,
      triggerConditions: rule.trigger_conditions,
      actions: rule.actions,
      isActive: rule.is_active
    });
    setShowCreateModal(true);
  };

  const handleDelete = (ruleId, ruleName) => {
    if (window.confirm(`Are you sure you want to delete the rule "${ruleName}"?`)) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  const addCondition = () => {
    setNewRule(prev => ({
      ...prev,
      triggerConditions: {
        ...prev.triggerConditions,
        conditions: [
          ...prev.triggerConditions.conditions,
          { field: 'ticket.status', operator: 'equals', value: '' }
        ]
      }
    }));
  };

  const removeCondition = (index) => {
    setNewRule(prev => ({
      ...prev,
      triggerConditions: {
        ...prev.triggerConditions,
        conditions: prev.triggerConditions.conditions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCondition = (index, field, value) => {
    setNewRule(prev => ({
      ...prev,
      triggerConditions: {
        ...prev.triggerConditions,
        conditions: prev.triggerConditions.conditions.map((condition, i) => 
          i === index ? { ...condition, [field]: value } : condition
        )
      }
    }));
  };

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        { type: 'assign_ticket', assignee_id: '' }
      ]
    }));
  };

  const removeAction = (index) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index, field, value) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const getEventLabel = (event) => {
    const eventLabels = {
      'ticket_created': 'Ticket Created',
      'ticket_updated': 'Ticket Updated',
      'ticket_status_changed': 'Status Changed',
      'ticket_assigned': 'Ticket Assigned',
      'comment_added': 'Comment Added'
    };
    return eventLabels[event] || event;
  };

  const getActionLabel = (action) => {
    const actionLabels = {
      'assign_ticket': 'Assign Ticket',
      'change_status': 'Change Status',
      'change_priority': 'Change Priority',
      'add_tags': 'Add Tags',
      'send_email': 'Send Email',
      'add_comment': 'Add Comment',
      'escalate': 'Escalate'
    };
    return actionLabels[action.type] || action.type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BoltIcon className="h-8 w-8 mr-3 text-primary-600" />
            Automation Rules
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Automate your workflow with intelligent rules and triggers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BoltIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Rules</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {rules?.length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlayIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Active Rules</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {rules?.filter(r => r.is_active).length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Executions Today</dt>
              <dd className="text-2xl font-semibold text-gray-900">142</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Automation Rules</h3>
        </div>
        
        {error && (
          <div className="p-6 bg-red-50 border-l-4 border-red-400">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">Failed to load automation rules</p>
            </div>
          </div>
        )}

        {rules?.length === 0 ? (
          <div className="p-12 text-center">
            <BoltIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No automation rules</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first automation rule.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Rule
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rules?.map((rule) => (
              <div key={rule.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{rule.name}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {rule.description && (
                      <p className="mt-1 text-sm text-gray-500">{rule.description}</p>
                    )}

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="font-medium">When:</span>
                      <span className="ml-1">{getEventLabel(rule.trigger_conditions?.event)}</span>
                      {rule.trigger_conditions?.conditions?.length > 0 && (
                        <>
                          <ChevronRightIcon className="h-4 w-4 mx-2" />
                          <span>{rule.trigger_conditions.conditions.length} condition(s)</span>
                        </>
                      )}
                      <ChevronRightIcon className="h-4 w-4 mx-2" />
                      <span className="font-medium">Do:</span>
                      <span className="ml-1">{rule.actions?.length || 0} action(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRuleMutation.mutate({
                        ruleId: rule.id,
                        isActive: !rule.is_active
                      })}
                      className={`p-2 rounded-md ${
                        rule.is_active
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={rule.is_active ? 'Pause rule' : 'Activate rule'}
                    >
                      {rule.is_active ? (
                        <PauseIcon className="h-4 w-4" />
                      ) : (
                        <PlayIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                      title="Edit rule"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id, rule.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete rule"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingRule ? 'Edit Automation Rule' : 'Create Automation Rule'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newRule.name}
                        onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Auto-assign urgent tickets"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        className="form-input"
                        rows={2}
                        value={newRule.description}
                        onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Automatically assign urgent tickets to senior agents"
                      />
                    </div>

                    {/* Trigger */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trigger Event</label>
                      <select
                        className="form-input"
                        value={newRule.triggerConditions.event}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          triggerConditions: { ...prev.triggerConditions, event: e.target.value }
                        }))}
                      >
                        <option value="ticket_created">Ticket Created</option>
                        <option value="ticket_updated">Ticket Updated</option>
                        <option value="ticket_status_changed">Status Changed</option>
                        <option value="ticket_assigned">Ticket Assigned</option>
                        <option value="comment_added">Comment Added</option>
                      </select>
                    </div>

                    {/* Conditions */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Conditions</label>
                        <button
                          type="button"
                          onClick={addCondition}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          + Add Condition
                        </button>
                      </div>
                      
                      {newRule.triggerConditions.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <select
                            className="form-input flex-1"
                            value={condition.field}
                            onChange={(e) => updateCondition(index, 'field', e.target.value)}
                          >
                            <option value="ticket.status">Status</option>
                            <option value="ticket.priority">Priority</option>
                            <option value="ticket.subject">Subject</option>
                            <option value="ticket.requester_email">Requester Email</option>
                            <option value="ticket.assignee_id">Assignee</option>
                          </select>
                          
                          <select
                            className="form-input flex-1"
                            value={condition.operator}
                            onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                          >
                            <option value="equals">Equals</option>
                            <option value="not_equals">Not Equals</option>
                            <option value="contains">Contains</option>
                            <option value="not_contains">Does Not Contain</option>
                            <option value="is_empty">Is Empty</option>
                            <option value="is_not_empty">Is Not Empty</option>
                          </select>
                          
                          <input
                            type="text"
                            className="form-input flex-1"
                            value={condition.value}
                            onChange={(e) => updateCondition(index, 'value', e.target.value)}
                            placeholder="Value"
                          />
                          
                          <button
                            type="button"
                            onClick={() => removeCondition(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Actions</label>
                        <button
                          type="button"
                          onClick={addAction}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          + Add Action
                        </button>
                      </div>
                      
                      {newRule.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <select
                            className="form-input flex-1"
                            value={action.type}
                            onChange={(e) => updateAction(index, 'type', e.target.value)}
                          >
                            <option value="assign_ticket">Assign Ticket</option>
                            <option value="change_status">Change Status</option>
                            <option value="change_priority">Change Priority</option>
                            <option value="add_tags">Add Tags</option>
                            <option value="add_comment">Add Comment</option>
                            <option value="escalate">Escalate</option>
                          </select>
                          
                          {action.type === 'change_status' && (
                            <select
                              className="form-input flex-1"
                              value={action.status || ''}
                              onChange={(e) => updateAction(index, 'status', e.target.value)}
                            >
                              <option value="">Select Status</option>
                              <option value="open">Open</option>
                              <option value="pending">Pending</option>
                              <option value="solved">Solved</option>
                              <option value="closed">Closed</option>
                            </select>
                          )}
                          
                          {action.type === 'change_priority' && (
                            <select
                              className="form-input flex-1"
                              value={action.priority || ''}
                              onChange={(e) => updateAction(index, 'priority', e.target.value)}
                            >
                              <option value="">Select Priority</option>
                              <option value="low">Low</option>
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          )}
                          
                          {action.type === 'add_comment' && (
                            <input
                              type="text"
                              className="form-input flex-1"
                              value={action.comment || ''}
                              onChange={(e) => updateAction(index, 'comment', e.target.value)}
                              placeholder="Comment text"
                            />
                          )}
                          
                          <button
                            type="button"
                            onClick={() => removeAction(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={newRule.isActive}
                        onChange={(e) => setNewRule(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="form-checkbox"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Activate this rule immediately
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createRuleMutation.isLoading || updateRuleMutation.isLoading}
                    className="btn-primary sm:ml-3"
                  >
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingRule(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automation;