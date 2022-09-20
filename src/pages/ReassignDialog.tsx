import { createReference } from '@medplum/core';
import { Practitioner, Resource, Task } from '@medplum/fhirtypes';
import { Dialog, Form, ResourceInput, useMedplum } from '@medplum/react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface ReassignDialogProps {
  task?: Task;
  onOk: () => void;
  onCancel: () => void;
}

export function ReassignDialog(props: ReassignDialogProps): JSX.Element | null {
  const medplum = useMedplum();
  const [assignee, setAssignee] = useState<Resource>();
  if (!props.task) {
    return null;
  }

  function onOk(): void {
    medplum
      .updateResource({
        ...(props.task as Task),
        owner: createReference(assignee as Practitioner),
      })
      .then(() => toast.success('Task reassigned'))
      .then(() => props.onOk())
      .catch((err) => toast.error(err.message));
  }

  return (
    <Dialog title="Reassign Task" visible={true} onOk={onOk} onCancel={props.onCancel}>
      <div style={{ width: 500, padding: '20px 50px' }}>
        <Form onSubmit={props.onOk}>
          <ResourceInput resourceType="Practitioner" name="assignee" onChange={setAssignee} />
        </Form>
      </div>
    </Dialog>
  );
}
