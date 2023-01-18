/**
 *            ..',;;::::;;,'.             
 *            .,:lodoolllllloodoc;'.         
 *          .:oooc;'...   ....,:lool;.       
 *        .:ool;.   ....        .':ool;.     
 *       'loo:.    .:cll'          'cooc.    
 *      .loo,         ,ol:.         .cooc.   
 *     .cdo;          .lddc.         .coo;   
 *     'odl.         .coooo:          ,odc.  
 *     ,od:.        'ldc:clo,         'odl.  
 *     'odc.       ,lo:. .,ol'        ,odl.  
 *     .ldo'     .;oo;     ;ol.      .:oo:   
 *      ,ool.   .:ol'      .col:c,   ;ool.   
 *       ;ool'  .,,.        .::,'. .;ool'    
 *        ,loo:.                 .,looc.     
 *         .;looc,..          .';lool,.      
 *           .,cooolc:;;;;;;:lodol:'.        
 *              .',:cllooollc:;,..           
 *                    ......                 
 * PROJECT LAMBDA
 */

require('dotenv').config();

import { readFileSync } from 'fs';
import { resolve } from 'path';

(globalThis as any).__approot = resolve(__dirname);
(globalThis as any).__configroot = resolve(__dirname, '..', 'config');
for (let line of readFileSync(resolve(__dirname, '../lambda.txt')).toString().split('\n')) {
    process.stdout.write(`\x1b[33m${line}\x1b[0m\n`);
}

console.log('Starting Lambda...');

console.time('Loaded Lambda');
import { Lambda } from './Lambda';
console.timeEnd('Loaded Lambda');
console.log();

Lambda.start();

const gracefulShutdown = async () => {
    await Lambda.stop();
}

process.on('SIGINT', async () => {
    await gracefulShutdown();
});

process.on('SIGTERM', async () => {
    await gracefulShutdown();
});
