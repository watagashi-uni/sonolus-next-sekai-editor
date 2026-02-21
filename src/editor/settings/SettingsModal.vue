<script setup lang="ts">
import { i18n } from '../../i18n'
import BaseModal from '../../modals/BaseModal.vue'
import SettingsEditor from './SettingsEditor.vue'
</script>

<template>
    <BaseModal :title="i18n.settings.title">
        <SettingsEditor />
    </BaseModal>
</template>
