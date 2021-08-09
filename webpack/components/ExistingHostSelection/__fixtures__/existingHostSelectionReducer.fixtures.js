import Immutable from 'seamless-immutable';
import {
   cloneDeep,
   findIndex,
   findLastIndex,
} from 'lodash';

import {
  existingHostSelectionConfData_1,
} from '../__fixtures__/existingHostSelectionConfData_1.fixtures';

export const successState = Immutable(existingHostSelectionConfData_1);

export const initExistingHostSelectionPayload = {
  payload: {
    serviceId: 2,
    alreadyUsedHosts: [
      {
        value: 5,
        label: 'isaac-anselm',
        disabled: true,
        tooltipText: 'Host already used for this application instance'
      }
    ],
    selectedHosts: [],
    hostsInHostgroup: {},
  }
};

export const existingHostSelectionSelectionChangedPayload = {
  selection: [
    {
      label: 'isaar-anselm',
      value: 3,
    },
  ]
};

export const loadExistingHostSelectionSuccessPayload = {
  hosts: [
    {
      ip: null,
      ip6: '',
      environment_id: null,
      environment_name: null,
      last_report: null,
      mac: '00:11:22:33:44:a1',
      realm_id: null,
      realm_name: null,
      sp_mac: null,
      sp_ip: null,
      sp_name: null,
      domain_id: 1,
      domain_name: 'mylocal',
      architecture_id: 1,
      architecture_name: 'x86_64',
      operatingsystem_id: 1,
      operatingsystem_name: 'centos 7',
      subnet_id: 1,
      subnet_name: 'mylocal',
      subnet6_id: null,
      subnet6_name: null,
      sp_subnet_id: null,
      ptable_id: 118,
      ptable_name: 'Kickstart default',
      medium_id: 1,
      medium_name: 'CentOS 7 mirror',
      pxe_loader: 'PXELinux BIOS',
      build: true,
      comment: '',
      disk: '',
      installed_at: null,
      model_id: null,
      hostgroup_id: 1,
      owner_id: 4,
      owner_name: 'Admin User',
      owner_type: 'User',
      enabled: true,
      managed: true,
      use_image: null,
      image_file: '',
      uuid: null,
      compute_resource_id: null,
      compute_resource_name: null,
      compute_profile_id: null,
      compute_profile_name: null,
      capabilities: [
        'build'
      ],
      provision_method: 'build',
      certname: 'isaac-anselm.mylocal',
      image_id: null,
      image_name: null,
      created_at: '2021-08-05 11:16:34 +0200',
      updated_at: '2021-08-05 11:16:34 +0200',
      last_compile: null,
      global_status: 0,
      global_status_label: 'Error',
      uptime_seconds: null,
      organization_id: 1,
      organization_name: 'Default Organization',
      location_id: 2,
      location_name: 'Default Location',
      puppet_status: 0,
      model_name: null,
      build_status: 2,
      build_status_label: 'Token expired',
      name: 'isaac-anselm.mylocal',
      id: 3,
      puppet_proxy_id: null,
      puppet_proxy_name: null,
      puppet_ca_proxy_id: null,
      puppet_ca_proxy_name: null,
      puppet_proxy: null,
      puppet_ca_proxy: null,
      hostgroup_name: 'base',
      hostgroup_title: 'base'
    },
    {
      ip: null,
      ip6: null,
      environment_id: null,
      environment_name: null,
      last_report: null,
      mac: '00:11:22:33:60:15',
      realm_id: null,
      realm_name: null,
      sp_mac: null,
      sp_ip: null,
      sp_name: null,
      domain_id: 1,
      domain_name: 'mylocal',
      architecture_id: 1,
      architecture_name: 'x86_64',
      operatingsystem_id: 1,
      operatingsystem_name: 'centos 7',
      subnet_id: 1,
      subnet_name: 'mylocal',
      subnet6_id: null,
      subnet6_name: null,
      sp_subnet_id: null,
      ptable_id: 118,
      ptable_name: 'Kickstart default',
      medium_id: 1,
      medium_name: 'CentOS 7 mirror',
      pxe_loader: 'PXELinux BIOS',
      build: true,
      comment: null,
      disk: null,
      installed_at: null,
      model_id: null,
      hostgroup_id: 1,
      owner_id: 4,
      owner_name: 'Admin User',
      owner_type: 'User',
      enabled: true,
      managed: true,
      use_image: null,
      image_file: '',
      uuid: null,
      compute_resource_id: null,
      compute_resource_name: null,
      compute_profile_id: null,
      compute_profile_name: null,
      capabilities: [
        'build'
      ],
      provision_method: 'build',
      certname: 'lllllll.mylocal',
      image_id: null,
      image_name: null,
      created_at: '2021-08-19 14:00:20 +0200',
      updated_at: '2021-08-19 14:00:20 +0200',
      last_compile: null,
      global_status: 0,
      global_status_label: 'Error',
      uptime_seconds: null,
      organization_id: 1,
      organization_name: 'Default Organization',
      location_id: 2,
      location_name: 'Default Location',
      puppet_status: 0,
      model_name: null,
      build_status: 2,
      build_status_label: 'Token expired',
      name: 'lllllll.mylocal',
      id: 7,
      puppet_proxy_id: null,
      puppet_proxy_name: null,
      puppet_ca_proxy_id: null,
      puppet_ca_proxy_name: null,
      puppet_proxy: null,
      puppet_ca_proxy: null,
      hostgroup_name: 'base',
      hostgroup_title: 'base'
    }
  ],
  serviceId: 1
};

export const loadExistingHostSelectionFailurePayload = {
  error: "Something really bad happend",
};
