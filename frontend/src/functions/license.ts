// This file contains a license notice, see the full AGPL license in LICENSE.md

import { shortVersionString } from "./version";

export const licenseNotice = `
DoubleNote is free software: you can redistribute it and/or modify it under the terms
of the GNU Affero General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

DoubleNote is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with DoubleNote.
If not, see <https://www.gnu.org/licenses/>.
\n`;

export function logLicenseNotice(): void {
  console.group(`DoubleNote ${shortVersionString} license notice`);
  console.log(licenseNotice);
  console.groupEnd();
}
