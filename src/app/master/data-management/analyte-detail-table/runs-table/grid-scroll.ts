// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ViewChild, Directive } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { translateXY } from './paging-utility';
import { RunRow } from '../../../../contracts/models/data-management/runs-table/run-row.model';

@Directive()
export abstract class GridScrollBase {
  @ViewChild('mainScroll', { static: true })
  mainScroll: PerfectScrollbarComponent;
  abstract getRows(): RunRow[];
  abstract triggerScrollStopEvent(): void;
  _scrollTimeout: any = null;

  pagedRows: Array<RunRow>;
  rowHeight = 43;
  scrollHeight = 0;
  viewPortHeight = 1000;
  indexes: { first: number; last: number };
  styleVirtualScrollbar: any = {};
  styleRowContainer: any = {};
  optionsShowed = false;

  updateFixedScroll(ev) {
    // Dont engage scroll when the row was inserted and has options showing
    if (this.optionsShowed) {
      return false;
    }

    const scrollYPos = ev.target.scrollTop;
    const viewPortHeight = ev.target.clientHeight;

    this.updateRowIndexes(scrollYPos, viewPortHeight);
    this.updatePageRows(this.getRows());

    this.triggerScrollStopEvent();
  }

  setOptionsShowed(bool) {
    this.optionsShowed = bool;
  }

  updatePageRows(rows: RunRow[]) {
    const { first, last } = this.indexes;

    let rowIndex = first;
    let idx = 0;
    const temp: any[] = [];

    while (rowIndex < last && rowIndex < rows.length) {
      const row = rows[rowIndex];

      if (row) {
        const newRow = { ...row };
        newRow.runIndex = rowIndex;
        temp[idx] = newRow;
        idx++;
      }

      rowIndex++;
    }

    this.pagedRows = temp;
  }

  updateRowIndexes(scrollYPos: number = 0, viewPortHeight: number = 0): any {
    let first, last = 0;

    if (viewPortHeight > 0) {
      this.viewPortHeight = viewPortHeight;
    }

    // Calculation of the first and last indexes will be based on where the scrollY position would be at.
    const height = Math.ceil(this.viewPortHeight);

    first = this.getRowIndex(scrollYPos);
    last = this.getRowIndex(height + scrollYPos) + 1;

    first = Math.floor(first) - 1;
    last = Math.ceil(last) - 1;

    // fix for PBI 162663 Point Rows disappear on Data Table
    if (last <= 10) {
      last = 10;
    }

    this.indexes = { first, last };
  }

  getRowIndex(scrollYPos) {
    if (scrollYPos === 0) {
      return 0;
    }

    return scrollYPos / this.rowHeight;
  }

  updateVirtualScrollbar(numberOfRows) {
    this.scrollHeight = this.rowHeight * numberOfRows;
    this.styleVirtualScrollbar = { height: `${this.scrollHeight}px` };
  }

  resetVerticalScrollbarPosition() {
    this.mainScroll.directiveRef.scrollToTop();
  }

  getRowContainerStyle() {
    const styles = {};

    const idx = this.indexes.first;

    const pos = idx * this.rowHeight;

    translateXY(styles, 0, pos);
    this.styleRowContainer = styles;
    return styles;
  }
}
