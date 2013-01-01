// Copyright (C) 2012 Stéphane Démurget <stephane.demurget@free.fr>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Author: Stéphane Démurget <stephane.demurget@free.fr>

const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;


const PopupStressTestButton = new Lang.Class({
    Name: "PopupStressTestButton",
    Extends: PanelMenu.Button,

	_init: function() {
		this.parent(0.5);

		let icon = new St.Icon({
		    icon_name: 'starred-symbolic',
		    style_class: 'system-status-icon stress-test-icon'
		});

	    this.actor.add_actor(icon);
    },

    _onButtonPress: function(actor, event) {
        Mainloop.timeout_add(200, Lang.bind(this, this._onTimeout));
        this._loop = 1;
        this._buttonIdx = 0;
        this._opened = false;
    },

    _onTimeout: function() {
        let roles = ["a11y", "volume", "network", "battery", "userMenu"];
        let button = Main.panel.statusArea[roles[this._buttonIdx]];

        log("*** LOOP #" + this._loop +  ": button = " + this._buttonIdx + ", popup = " + this._opened);

        button.menu.toggle();

        this._opened = !this._opened;

        if (this._opened)
            return true;

        this._buttonIdx = (this._buttonIdx + 1) % roles.length;

        if (this._buttonIdx == 0)
            this._loop = this._loop + 1;

        return this._loop <= 100;
    }
});


let stressTestButton;

function init() {
    
}

function enable() {
    stressTestButton = new PopupStressTestButton();
    Main.panel.addToStatusArea("popup-stress-test", stressTestButton, 0, "center");
}

function disable() {
    stressTestButton.destroy();
}

