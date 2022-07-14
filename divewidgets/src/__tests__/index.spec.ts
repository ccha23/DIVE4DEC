// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { JSXGraphModel } from '..';

describe('JSXGraph', () => {
  describe('JSXGraphModel', () => {
    it('should be createable', () => {
      const model = createTestModel(JSXGraphModel);
      expect(model).toBeInstanceOf(JSXGraphModel);
      expect(model.get('id')).toEqual('box');
    });

    it('should be createable with a value', () => {
      const state = { id: 'jxgbox' };
      const model = createTestModel(JSXGraphModel, state);
      expect(model).toBeInstanceOf(JSXGraphModel);
      expect(model.get('id')).toEqual('jxgbox');
    });
  });
});
