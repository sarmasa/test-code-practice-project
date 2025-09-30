// database 接続 sqlite3
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// データベースファイルのパス
const dbPath = join(__dirname, '..', 'database.sqlite');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Promiseベースのクエリ実行関数
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // SELECT系のクエリ
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({ rows, rowCount: rows.length });
        }
      });
    }
    // INSERT系のクエリ（RETURNING付き）
    else if (sql.trim().toUpperCase().startsWith('INSERT')) {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          // INSERTされた行を取得
          db.get('SELECT * FROM employee_details WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve({ rows: [row], rowCount: 1 });
            }
          });
        }
      });
    }
    // UPDATE系のクエリ（RETURNING付き）
    else if (sql.trim().toUpperCase().startsWith('UPDATE')) {
      // まず、更新対象のIDを抽出する（パラメータの最後がID）
      const id = params[params.length - 1];
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes === 0) {
            resolve({ rows: [], rowCount: 0 });
          } else {
            // 更新された行を取得
            db.get('SELECT * FROM employee_details WHERE id = ?', [id], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve({ rows: [row], rowCount: this.changes });
              }
            });
          }
        }
      });
    }
    // DELETE系のクエリ
    else if (sql.trim().toUpperCase().startsWith('DELETE')) {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ rows: [], rowCount: this.changes });
        }
      });
    }
    // その他のクエリ（CREATE TABLE等）
    else {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ rows: [], rowCount: this.changes });
        }
      });
    }
  });
};

export default db;
