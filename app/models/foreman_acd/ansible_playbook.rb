# frozen_string_literal: true

module ForemanAcd
  # Ansible playbook
  class AnsiblePlaybook < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    self.table_name = 'acd_ansible_playbooks'
    has_many :app_definitions

    validates :name, :presence => true, :uniqueness => true
    scoped_search :on => :name

    def self.humanize_class_name(_name = nil)
      _('Ansible playbook')
    end

    def self.permission_name
      'ansible_playbooks'
    end
  end
end
